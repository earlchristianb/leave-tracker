import { queryClient } from "@/providers/ReactQueryClientProvider";
import { User } from "@/types/user.type";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import Button from "../Button";
import Input from "../Input";
import Form from "../Form";
import { useCreateUserMutation } from "@/hooks/user/userQueries";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";

const ProfileForm = () => {
  const { getPermission, getUser } = useKindeBrowserClient();
  const [userProfile, setUserProfile] = React.useState({
    firstName: "",
    lastName: "",
    role: getPermission("is:admin")?.isGranted ? "admin" : "user",
    email: "",
  });

  const createToast = useCreateToast();

  const handleUserProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (getUser()?.given_name || getUser()?.family_name || getUser()?.email) {
      setUserProfile({
        firstName: getUser()?.given_name ?? "",
        lastName: getUser()?.family_name ?? "",
        role: getPermission("is:admin")?.isGranted ? "admin" : "user",
        email: getUser()?.email ?? "",
      });
    }
  }, [getUser()?.given_name, getUser()?.family_name]);

  const mutateCurrentUser = useCreateUserMutation();
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await mutateCurrentUser.mutateAsync({
            email: userProfile.email,
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            role: userProfile.role,
          });
          createToast(ToastType.SUCCESS, ToastMessages.USER.SUCCESS_CREATE);
        } catch (error) {
          createToast(ToastType.ERROR, ToastMessages.USER.ERROR_CREATE);
        }
      }}
    >
      <h1 className="text-xl">Create a Profile</h1>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>First Name*</label>
        <Input
          name="firstName"
          value={userProfile.firstName}
          onChange={handleUserProfileChange}
          type="text"
          required
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Last Name*</label>
        <Input
          name="lastName"
          value={userProfile.lastName}
          onChange={handleUserProfileChange}
          type="text"
          required
        />
      </div>

      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Email</label>
        <Input
          disabled
          name="email"
          value={userProfile.email}
          onChange={handleUserProfileChange}
          type="text"
        />
      </div>
      <Button type="submit">Submit </Button>
    </Form>
  );
};

export default ProfileForm;
