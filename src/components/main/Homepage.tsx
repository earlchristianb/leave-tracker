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
import LeavesTable from "./LeavesTable";
import CreateLeaveForm from "../forms/create-leave.form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { PieChart } from "../Piechart";
import { colorList } from "@/utils/colorlist";
const Homepage = () => {
  const { isAuthenticated, getUser, getAccessTokenRaw, isLoading, getClaim } =
    useKindeBrowserClient();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Leaves");
  const user = getUser();
  const createToast = useCreateToast();

  const currentUser = useCurrentUserQuery(user?.id, user);
  const getLeavesByUser = useGetLeavesByUserQuery(currentUser.data?.id);
  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    currentUser.data?.organization?.id,
  );
  const leaveLabels = useMemo(() => {
    return getLeaveTypes.data?.map((leaveType) => leaveType.leaveName);
  }, [getLeaveTypes.data]);
  const handleToggle = (tab: string) => {
    setCurrentTab(tab);
  };

  // const leaveData = useMemo(() => {
  //   return leaveLabels?.map((leaveLabel) => {
  //     return getLeavesByUser.data?.filter(
  //       (leave) => leave.leaveType.leaveName === leaveLabel,
  //     ).length;
  //   });
  // }, [leaveLabels, getLeavesByUser.data]);
  const countLeaves = (leaveLabels: string[], leaves: any[]) => {
    return leaveLabels?.map((leaveLabel) => {
      return leaves
        ?.filter((leave) => leave.leaveType.leaveName === leaveLabel)
        .map((leave) => leave.dates)
        .flat();
    });
  };

  const countCurrentYearLeaves = (leaveData: any[], currentYear: number) => {
    return leaveData.map((dates) => {
      return (
        dates?.filter(
          (date: string) => new Date(date).getFullYear() === currentYear,
        ).length || 0
      );
    });
  };

  const leaveData = useMemo(() => {
    return countLeaves(leaveLabels || [], getLeavesByUser.data || []);
  }, [leaveLabels, getLeavesByUser.data]);
  const filteredLeaveData = useMemo(() => {
    return (leaveData || []).map((data) => (data ? data.length : 0));
  }, [leaveData]);
  const currentYear = new Date().getFullYear();
  const currentYearLeaveCounts = useMemo(() => {
    return countCurrentYearLeaves(leaveData, currentYear);
  }, [leaveData, currentYear]);
  const leaveDataLength = useMemo(() => {
    return leaveData?.flatMap((data) => data).length;
  }, [leaveData]);
  const backgroundColor = useMemo(() => {
    return colorList.slice(0, leaveLabels?.length);
  }, [leaveLabels?.length]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading]);

  if (currentUser.isLoading || isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-darker">
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

  // const currentPage = 1;
  // const itemsPerPage = 10;
  // const correctIndex = (currentPage - 1) * itemsPerPage + index + 1;

  console.log("Leave labels", leaveLabels);
  console.log("Leave data", leaveData);
  console.log("Current Year leave counts", currentYearLeaveCounts);
  console.log("All leaves", leaveDataLength);
  const piechartData = {
    labels: leaveLabels || [],
    datasets: [
      {
        data: filteredLeaveData,
        backgroundColor: backgroundColor || [],
      },
    ],
  };

  return (
    <div className="flex h-full w-full flex-col bg-lighter text-black dark:bg-darkest md:h-screen">
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

          <p>Hello {currentUser.data?.name}</p>
        </div>
      </Topbar>
      <div className="flex h-full w-full flex-col items-center bg-lightest dark:bg-dark">
        <div className="flex w-full flex-col space-y-4">
          <div className="flex h-52 p-2">
            {leaveData && leaveLabels && (
              <div className="h-52">
                <PieChart data={piechartData} key="piechart1" />
              </div>
            )}
            <div className="flex justify-center divide-x-2">
              <div className="w-full">
                <p className="text-xl font-bold">Total Leaves</p>
                <div className="h-20 p-4 dark:bg-dark">
                  <p>Leaves</p>
                  <p>{leaveDataLength}</p>
                </div>
              </div>
              <div className="w-full">
                <p className="text-center text-xl font-bold">Current Year</p>
                <div className="h-20 p-4 text-center">
                  <p>Leaves</p>
                  <p>
                    {currentYearLeaveCounts.reduce(
                      (sum, count) => sum + count,
                      0,
                    )}
                  </p>
                </div>
                <div className="flex">
                  {currentYearLeaveCounts &&
                    leaveLabels &&
                    leaveLabels.map((labels, index) => (
                      <div className="h-30 p-4 text-center dark:bg-dark">
                        <p>{labels}</p>
                        <p>{currentYearLeaveCounts[index]}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-full">
            <div className="flex w-full">
              <Button
                className="h-fit rounded-none text-left text-lg"
                onClick={() => {
                  handleToggle("Leaves");
                }}
              >
                <p className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faReceipt} className="text-xl" />
                  <span>Leaves</span>
                </p>
              </Button>
              <Button
                className="h-fit self-end text-nowrap rounded-none text-left text-lg"
                onClick={() => {
                  handleToggle("Create Leaves");
                }}
              >
                <p className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faAdd} className="text-xl" />
                  <span>File a Leave</span>
                </p>
              </Button>
            </div>
            <div className="h-full w-full">
              {currentTab === "Leaves" ? (
                <LeavesTable getLeavesByUser={getLeavesByUser} />
              ) : (
                <CreateLeaveForm
                  currentUser={currentUser}
                  getLeaveTypes={getLeaveTypes}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
