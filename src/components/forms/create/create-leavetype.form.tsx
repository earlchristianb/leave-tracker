"use client";
import React, { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";
import { useCreateOrgLeaveTypeMutation } from "@/hooks/organization/organizationQueries";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import Form from "../../Form";
import { CreateOrgLeaveTypeDto, OrgLeaveType } from "@/types/organization.type";
import { UseQueryResult } from "@tanstack/react-query";
import { User } from "@/types/user.type";

const emptyOrgLeaveForm = {
  abbreviation: "",
  leaveName: "",
  leaveDescription: "",
  maxLeavesPerYear: 5,
  additionalInfo: "",
  monthlyRestriction: 0,
};

const CreateOrgLeaveTypeForm = ({
  currentUser,
  orgLeaveTypeQuery,
  showHint = false,
}: {
  currentUser: UseQueryResult<User, Error>;
  orgLeaveTypeQuery: UseQueryResult<OrgLeaveType[], Error>;
  showHint?: boolean;
}) => {
  const createToast = useCreateToast();

  const [orgLeaveForm, setOrgLeaveForm] =
    useState<CreateOrgLeaveTypeDto>(emptyOrgLeaveForm);
  const handleOrganizationFormChanges = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrgLeaveForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "monthlyRestriction" ||
        e.target.name === "maxLeavesPerYear"
          ? e.target.valueAsNumber
          : e.target.value,
    }));
  };
  const createOrgLeaveTypeMutation = useCreateOrgLeaveTypeMutation();

  console.log("FORM ORG LEAVE", orgLeaveForm);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form state", orgLeaveForm);
    console.log("submitting");
    try {
      await createOrgLeaveTypeMutation.mutateAsync({
        organizationId: currentUser.data?.organization?.id!,
        body: orgLeaveForm,
      });
      setOrgLeaveForm(emptyOrgLeaveForm);
      createToast(ToastType.SUCCESS, ToastMessages.ORGLEAVETYPE.SUCCESS_CREATE);
    } catch (error) {
      createToast(ToastType.ERROR, ToastMessages.ORGLEAVETYPE.ERROR_CREATE);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <h1 className="text-xl">
        Create a Type of Leave for {currentUser.data?.organization?.name}
      </h1>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Name*</label>
        <Input
          name="leaveName"
          value={orgLeaveForm.leaveName}
          onChange={handleOrganizationFormChanges}
          type="text"
          required
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Description </label>
        <Input
          name="leaveDescription"
          value={orgLeaveForm.leaveDescription}
          onChange={handleOrganizationFormChanges}
          type="text"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Abbreviation</label>
        <Input
          name="abbreviation"
          value={orgLeaveForm.abbreviation}
          required
          minLength={2}
          maxLength={5}
          onChange={handleOrganizationFormChanges}
          type="text"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Additional Info</label>
        <Input
          name="additionalInfo"
          className="h-auto resize"
          aria-multiline
          value={orgLeaveForm.additionalInfo}
          onChange={handleOrganizationFormChanges}
          type="text"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Max Leaves Per Year*</label>
        <Input
          name="maxLeavesPerYear"
          required
          min={1}
          value={orgLeaveForm.maxLeavesPerYear}
          onChange={handleOrganizationFormChanges}
          type="number"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Monthly Restriction*</label>
        <Input
          name="monthlyRestriction"
          required
          min={0}
          value={orgLeaveForm.monthlyRestriction}
          onChange={handleOrganizationFormChanges}
          type="number"
        />
      </div>
      {orgLeaveTypeQuery.data &&
        (orgLeaveTypeQuery.data.length ? (
          <p className="flex flex-wrap items-center space-x-2 md:flex-nowrap">
            <span> Leave Types created:</span>
            {orgLeaveTypeQuery.data.map((leaveType: OrgLeaveType) => (
              <span
                key={leaveType.id}
                className="rounded bg-light p-2 dark:bg-dark"
              >
                {leaveType.leaveName}
              </span>
            ))}
            {showHint && (
              <span className="animate-bounce font-semibold">
                You can create more Leave Types before proceeding to team
                section
              </span>
            )}
          </p>
        ) : (
          <div>No Leave Type yet</div>
        ))}
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateOrgLeaveTypeForm;
