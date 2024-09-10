"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import TopBar from "../TopBar";
import Image from "next/image";
import { useGetLeavesByUserQuery } from "@/hooks/leave/leave.Queries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import { useCreateToast } from "@/providers/ToastProvider";
import LeavesTable from "../LeavesTable";
import CreateLeaveForm from "../forms/create/create-leave.form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { PieChart } from "../Piechart";
import { colorList } from "@/utils/colorlist";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";

const Tabs = {
  Leaves: "Leaves",
  CreateLeaves: "Create Leaves",
} as const;
type TabType = (typeof Tabs)[keyof typeof Tabs];
const Homepage = () => {
  const { isAuthenticated, getUser, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<TabType>(Tabs.Leaves);
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
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(e.currentTarget.name as TabType);
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
  const pieChartData = {
    labels: leaveLabels || [],
    datasets: [
      {
        data: filteredLeaveData,
        backgroundColor: backgroundColor || [],
      },
    ],
  };

  return (
    <PageContainer>
      <TopBar>
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
      </TopBar>
      <SectionContainer>
        <div className="w-full space-y-4">
          <div className="flex w-full flex-col space-x-0 space-y-2 lg:h-52 lg:flex-row lg:space-x-2 lg:space-y-0">
            {leaveData && leaveLabels && (
              <div className="flex h-52 w-full justify-center bg-light p-2 shadow dark:bg-darker lg:w-auto">
                <PieChart data={pieChartData} key="piechart1" />
              </div>
            )}
            <div className="flex h-full w-full flex-col items-center justify-center bg-light p-2 shadow dark:bg-darker lg:h-52 lg:flex-row">
              {leaveDataLength && (
                <div className="w-full p-4 text-center">
                  <p className="w-full text-xl font-bold">Total Leaves</p>
                  <div className="h-full p-4">
                    <p className="">Leaves</p>
                    <p className="text-xl">{leaveDataLength}</p>
                  </div>
                </div>
              )}
              {currentYearLeaveCounts && leaveLabels && (
                <div className="flex h-full w-full flex-col items-center justify-center lg:flex-row">
                  <div className="w-full p-4">
                    <p className="text-center text-xl font-bold">
                      Current Year
                    </p>
                    <div className="flex h-full w-full flex-col items-center justify-center lg:flex-row">
                      <div className="w-fit p-4">
                        <p>Leaves</p>
                        <p className="text-center text-xl">
                          {currentYearLeaveCounts.reduce(
                            (sum, count) => sum + count,
                            0,
                          )}
                        </p>
                      </div>
                      {currentYearLeaveCounts &&
                        leaveLabels &&
                        leaveLabels.map((labels, index) => (
                          <div className="w-fit p-4">
                            <p className="text-nowrap">{labels}</p>
                            <p className="text-center">
                              {currentYearLeaveCounts[index]}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-fit rounded bg-light p-1 text-sm font-medium text-black dark:bg-raisin_black-600 dark:text-white">
            <button
              type="button"
              onClick={handleToggle}
              name={Tabs.Leaves}
              className={`flex items-center space-x-0.5 rounded ${currentTab === Tabs.Leaves ? "bg-white dark:text-black" : ""} p-1`}
            >
              <FontAwesomeIcon icon={faReceipt} className="text-xl" />
              <span>Leaves</span>
            </button>
            <button
              type="button"
              name={Tabs.CreateLeaves}
              onClick={handleToggle}
              className={`flex items-center space-x-0.5 rounded ${currentTab === Tabs.CreateLeaves ? "bg-white dark:text-black" : ""} p-1`}
            >
              {" "}
              <FontAwesomeIcon icon={faAdd} className="text-xl" />
              <span>File a Leave</span>
            </button>
          </div>
          <div className="min-h-[30%] w-full overflow-x-auto">
            {currentTab === "Leaves" ? (
              <LeavesTable getLeaves={getLeavesByUser} isAdmin={false} />
            ) : (
              <CreateLeaveForm
                currentUser={currentUser}
                getLeaveTypes={getLeaveTypes}
              />
            )}
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default Homepage;
