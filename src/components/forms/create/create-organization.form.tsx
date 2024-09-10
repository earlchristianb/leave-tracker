"use client";
import React, { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";
import { useCreateOrgMutation } from "@/hooks/organization/organizationQueries";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import Form from "../../Form";

const CreateOrganizationForm = () => {
  const createToast = useCreateToast();

  const [organizationForm, setOrganizationForm] = useState({
    name: "",
    driveLink: "",
    inviteCode: "",
    description: "",
  });
  const handleOrganizationFormChanges = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganizationForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const createOrgMutation = useCreateOrgMutation();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form state", organizationForm);
    console.log("submitting");
    try {
      await createOrgMutation.mutateAsync(organizationForm);
      createToast(ToastType.SUCCESS, ToastMessages.ORGANIZATION.SUCCESS_CREATE);
    } catch (error) {
      createToast(ToastType.ERROR, ToastMessages.ORGANIZATION.ERROR_CREATE);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <h1 className="text-xl">Create an Organization</h1>
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

export default CreateOrganizationForm;
