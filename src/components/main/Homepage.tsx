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
import { Leave } from "@/types/leave.type";
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
  const [leaveForm, setLeaveForm] = useState<LeaveFormState>(emptyLeaveForm);

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

  // const currentPage = 1;
  // const itemsPerPage = 10;
  // const correctIndex = (currentPage - 1) * itemsPerPage + index + 1;

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
            <div className="flex w-fit border-r sm:flex-col md:h-full">
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
                <section className="scrollbar-thin w-full text-left drop-shadow-2xl">
                  <div className="w-full">
                    <div className="relative w-full divide-gray-500 truncate rounded-lg text-center">
                      <div className="flex items-center border-b dark:bg-dark dark:text-white">
                        <p className="w-10 p-2"></p>
                        <div
                          className={`relative grid w-full grid-cols-2 place-items-center px-4 py-2 text-left md:grid-cols-4 lg:grid-cols-5`}
                        >
                          <p className="w-full">Type of leave</p>
                          <p className="hidden w-full md:block">Filed Date</p>
                          <p className="w-full">Dates</p>
                          <p className="hidden w-full lg:block">Reason</p>
                          <p className="hidden w-full md:block">File link</p>
                        </div>
                      </div>
                      {getLeavesByUser.data &&
                        getLeavesByUser.data.length &&
                        getLeavesByUser.data.map((leave: Leave, index) => (
                          <div
                            className="flex w-full items-center transition duration-300 hover:cursor-pointer hover:bg-slate-100"
                            onDoubleClick={() => {}}
                          >
                            <p
                              className={`${!(index % 2 == 0) && `bg-transparent`} w-10 p-2`}
                            >
                              {/* {correctIndex} */}
                              {index + 1}
                            </p>
                            <div
                              key={index + 1}
                              className={`relative grid w-full grid-cols-2 place-items-center p-2 text-left md:grid-cols-4 lg:grid-cols-5 ${
                                !(index % 2 == 0) && "bg-transparent"
                              }`}
                            >
                              <p className="w-full">
                                {leave?.leaveType?.leaveName}
                              </p>
                              <p className="hidden w-full md:block">
                                {new Date(
                                  leave?.created_at,
                                ).toLocaleDateString()}
                              </p>
                              <p className="hidden w-full lg:block">
                                {leave.reason}
                              </p>
                              <p className="w-full">
                                {leave.dates
                                  .map((date) =>
                                    new Date(date).toLocaleDateString(),
                                  )
                                  .join(", ")}
                              </p>
                              <p className="hidden w-full md:block">
                                {leave?.fileLink}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </section>
              ) : (
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
                      createToast(
                        ToastType.SUCCESS,
                        ToastMessages.LEAVE.SUCCESS_CREATE,
                      );
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
