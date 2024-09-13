"use client";
import React, { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";
import { useUpdateOrgLeaveTypeMutation } from "@/hooks/organization/organizationQueries";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import Form from "../../Form";
import { OrgLeaveType } from "@/types/organization.type";
import { UseQueryResult } from "@tanstack/react-query";
import { User } from "@/types/user.type";

const emptyOrgLeaveForm = {
  abbreviation: "",
  leaveName: "",
  leaveDescription: "",
  maxLeavesPerYear: 5,
  additionalInfo: "",
  monthlyRestriction: 0,
  created_at: "",
  updated_at: "",
  organization: {
    id: "",
    inviteCode: "",
    name: "",
    description: "",
    driveLink: "",
    created_at: "",
    updated_at: "",
    teams: [],
  },
  id: "",
};

const UpdateLeaveTypeForm = ({
  currentUser,
  leaveTypeList,
}: {
  currentUser: UseQueryResult<User, Error>;
  leaveTypeList: OrgLeaveType[];
}) => {
  const [orgLeaveForm, setOrgLeaveForm] = useState<OrgLeaveType>(
    leaveTypeList[0] || emptyOrgLeaveForm,
  );
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>(
    leaveTypeList.length ? leaveTypeList[0].id : "",
  );
  const createToast = useCreateToast();
  const updateOrgLeaveType = useUpdateOrgLeaveTypeMutation();
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
  const handleSelectedLeaveTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLeaveType(e.target.value);
    setOrgLeaveForm(
      leaveTypeList.find((leaveType) => leaveType.id === e.target.value) ||
        emptyOrgLeaveForm,
    );
  };
  console.log("FORM ORG LEAVE", orgLeaveForm);
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form state", orgLeaveForm);
    console.log("submitting");

    try {
      const {
        monthlyRestriction,
        isActive,
        additionalInfo,
        abbreviation,
        leaveDescription,
        leaveName,
        maxLeavesPerYear,
      } = orgLeaveForm;
      await updateOrgLeaveType.mutateAsync({
        organizationId: currentUser.data?.organization?.id!,
        leaveTypeId: selectedLeaveType,
        body: {
          monthlyRestriction,
          additionalInfo,
          abbreviation,
          leaveDescription,
          leaveName,
          maxLeavesPerYear,
          isActive,
        },
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
      <h1 className="text-xl">Update Leave Type</h1>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Select Leave Type</label>
        <select
          className="w-full border-b border-darker p-1 dark:bg-gray-400"
          value={selectedLeaveType}
          onChange={handleSelectedLeaveTypeChange}
        >
          {leaveTypeList.map((leaveType: OrgLeaveType) => (
            <option key={leaveType.id} value={leaveType.id}>
              {leaveType.leaveName}
            </option>
          ))}
        </select>
      </div>

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
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default UpdateLeaveTypeForm;
