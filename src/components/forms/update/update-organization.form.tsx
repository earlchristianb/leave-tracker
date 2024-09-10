"use client";
import React, { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import Form from "../../Form";
import { useUpdateOrgMutation } from "@/hooks/organization/organizationQueries";

const UpdateOrganizationForm = ({
  name,
  driveLink,
  inviteCode,
  description,
  id,
}: {
  name: string;
  driveLink: string;
  inviteCode: string;
  description: string;
  id: string;
}) => {
  const createToast = useCreateToast();

  const [organizationForm, setOrganizationForm] = useState({
    name: name,
    driveLink: driveLink,
    inviteCode: inviteCode,
    description: description,
  });
  const updateOrgMutation = useUpdateOrgMutation();
  const handleOrganizationFormChanges = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganizationForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form state", organizationForm);
    console.log("submitting");
    try {
      await updateOrgMutation.mutateAsync({
        organizationId: id,
        data: organizationForm,
      });
      createToast(ToastType.SUCCESS, ToastMessages.ORGANIZATION.SUCCESS_UPDATE);
    } catch (error: any) {
      createToast(
        ToastType.ERROR,
        Array.isArray(error?.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message,
      );
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <h1 className="text-xl">Update Organization</h1>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Name*</label>
        <Input
          name="name"
          value={organizationForm.name}
          onChange={handleOrganizationFormChanges}
          type="text"
          required
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Description </label>
        <Input
          name="description"
          value={organizationForm.description}
          onChange={handleOrganizationFormChanges}
          type="text"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Google Drive Link*</label>
        <Input
          name="driveLink"
          value={organizationForm.driveLink}
          required
          onChange={handleOrganizationFormChanges}
          type="url"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>
          Invite Code*{" "}
          <span className="text-xs text-gray-400">
            The code to join your organization
          </span>
        </label>
        <Input
          name="inviteCode"
          maxLength={10}
          minLength={5}
          required
          value={organizationForm.inviteCode}
          onChange={handleOrganizationFormChanges}
          type="text"
        />
      </div>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default UpdateOrganizationForm;
