"use client";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import Topbar from "../Topbar";
import Image from "next/image";
import Button from "../Button";
import Form from "../Form";
import {
  useCreateLeaveMutation,
  useGetLeavesByUserQuery,
} from "@/hooks/leave/leave.Queries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import Input from "../Input";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
type LeaveFormState = {
  leaveTypeId: string;
  reason?: string;
  dates: string[];
  fileLink: string;
};
const Homepage = () => {
  const { isAuthenticated, getUser, getAccessTokenRaw, isLoading, getClaim } =
    useKindeBrowserClient();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Leaves");
  const user = getUser();
  const createToast = useCreateToast();
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);

  const currentUser = useCurrentUserQuery(user?.id, user);
  const getLeavesByUser = useGetLeavesByUserQuery(currentUser.data?.id);
  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    currentUser.data?.organization?.id,
  );
  const createLeave = useCreateLeaveMutation();
  const [leaveForm, setLeaveForm] = useState<LeaveFormState>({
    leaveTypeId: "",
    reason: "",
    dates: [],
    fileLink: "",
  });

  if (currentUser.isLoading || isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-dark">
        <p>Loading..</p>
      </div>
    );
  }

  if (
    !currentUser.isLoading &&
    (!currentUser.data ||
      !currentUser.data?.organization ||
      !currentUser.data?.team)
  ) {
    router.push("/onboarding");
  }
  const handleToggle = (tab: string) => {
    setCurrentTab(tab);
  };

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

  return (
    <div className="flex h-full w-full flex-col dark:bg-darker md:h-screen">
      <Topbar>
        <div className="flex items-center space-x-4">
          {user?.picture && (
            <Image
              src={user?.picture}
              className="h-10 w-10 rounded-full"
              width={40}
              height={40}
              alt="Profile Image"
            />
          )}

          <p>Welcome!{currentUser.data?.name}</p>
        </div>
      </Topbar>
      <div className="flex h-full w-full flex-col items-center justify-center dark:bg-darker">
        <div className="flex h-[90%] w-full flex-col space-y-4 p-2">
          <div className="flex h-full flex-col border sm:flex-row">
            <div className="flex h-full w-fit border-r sm:flex-col">
              <Button
                className="h-fit rounded-none text-left text-lg"
                onClick={() => {
                  handleToggle("Leaves");
                }}
              >
                Leaves
              </Button>
              <Button
                className="h-fit text-nowrap rounded-none text-left text-lg"
                onClick={() => {
                  handleToggle("Create Leaves");
                }}
              >
                File Leave
              </Button>
            </div>
            <div className="h-full w-full">
              {currentTab === "Leaves" ? (
                <div className="flex flex-col justify-center space-y-4 rounded-md border p-4 dark:border-gray-400 dark:bg-dark">
                  <p>Show the leaves here</p>
                </div>
              ) : (
                <Form
                  className="rounded-none"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!leaveForm.dates.length) {
                      return alert("Please select a date");
                    }

                    console.log("Form state", leaveForm);
                    try {
                      await createLeave.mutateAsync({
                        body: leaveForm,
                        userId: currentUser.data?.id!,
                      });
                      console.log("submitting");
                      createToast(
                        ToastType.SUCCESS,
                        ToastMessages.LEAVE.SUCCESS_CREATE,
                      );
                    } catch (error) {
                      createToast(
                        ToastType.ERROR,
                        ToastMessages.LEAVE.ERROR_CREATE,
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
                          <span className="hidden text-red-500 group-hover:block">
                            X
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <Button type="submit">Submit</Button>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
