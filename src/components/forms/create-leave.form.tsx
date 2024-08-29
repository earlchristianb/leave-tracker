import React, { useState } from "react";
import Form from "../Form";
import { useCreateLeaveMutation } from "@/hooks/leave/leave.Queries";
import { UseQueryResult } from "@tanstack/react-query";
import { User } from "@/types/user.type";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import { OrgLeaveType } from "@/types/organization.type";
import Input from "../Input";
import Button from "../Button";
type LeaveFormState = {
  leaveTypeId: string;
  reason?: string;
  dates: string[];
  fileLink: string;
};
const emptyLeaveForm = {
  leaveTypeId: "",
  reason: "",
  dates: [],
  fileLink: "",
};

const CreateLeaveForm = ({
  currentUser,
  getLeaveTypes,
}: {
  currentUser: UseQueryResult<User, Error>;
  getLeaveTypes: UseQueryResult<OrgLeaveType[], Error>;
}) => {
  const createLeave = useCreateLeaveMutation();
  const [leaveForm, setLeaveForm] = useState<LeaveFormState>(emptyLeaveForm);

  const handleLeaveFormChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    setLeaveForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "dates"
          ? [...prev.dates, e.target.value]
          : e.target.value,
    }));
  };
  const createToast = useCreateToast();
  return (
    <Form
      className="h-auto rounded-none border-0 lg:space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        // if (!leaveForm.dates.length) {
        //   return alert("Please select a date");
        // }

        console.log("Form state", leaveForm);
        try {
          await createLeave.mutateAsync({
            body: leaveForm,
            userId: currentUser.data?.id!,
          });
          console.log("submitting");
          createToast(ToastType.SUCCESS, ToastMessages.LEAVE.SUCCESS_CREATE);
          setLeaveForm(emptyLeaveForm);
        } catch (error: any) {
          console.log(error.response.data);
          createToast(
            ToastType.ERROR,
            Array.isArray(error.response.data.message)
              ? error.response.data.message[0]
              : error.response.data.message,
          );
        }
      }}
    >
      <h1 className="text-xl">File Leave</h1>
      <div className="flex w-full flex-col justify-start space-y-2 p-2">
        <label>Leave Type*</label>
        <select
          className="w-full border-b border-dark p-1 dark:bg-gray-400"
          value={leaveForm.leaveTypeId}
          onChange={handleLeaveFormChange}
          name="leaveTypeId"
          required
        >
          {getLeaveTypes.data &&
            getLeaveTypes.data?.map((leaveType) => (
              <>
                <option key={leaveType.id} value={leaveType.id}>
                  {leaveType.leaveName}
                </option>
              </>
            ))}
          <option key="defaultLeaveType" value="" disabled hidden>
            Select Leave Type
          </option>
        </select>
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Reason</label>
        <Input
          className="w-full border-b border-dark p-1 dark:bg-gray-400"
          type="text"
          name="reason"
          onChange={handleLeaveFormChange}
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>File Link</label>
        <Input
          className="w-full border-b border-dark p-1 dark:bg-gray-400"
          type="url"
          name="fileLink"
          required
          onChange={handleLeaveFormChange}
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>
          Dates{" "}
          <span className="text-gray-400">
            {leaveForm.dates &&
              leaveForm.dates.length > 0 &&
              `${leaveForm.dates.length} selected`}
          </span>
        </label>
        <Input
          className="w-full border-b border-dark p-1 dark:bg-gray-400"
          type="date"
          name="dates"
          onChange={handleLeaveFormChange}
        />
        <div className="flex">
          {leaveForm.dates.map((date) => (
            <p
              className="group flex space-x-1 p-2 duration-500 hover:cursor-pointer hover:bg-red-100"
              key={date}
              onClick={(e) =>
                setLeaveForm((prev) => ({
                  ...prev,
                  dates: prev.dates.filter(
                    (selectedDates) => selectedDates !== date,
                  ),
                }))
              }
            >
              <span>{date}</span>
              <span className="hidden text-red-500 group-hover:block">X</span>
            </p>
          ))}
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateLeaveForm;
