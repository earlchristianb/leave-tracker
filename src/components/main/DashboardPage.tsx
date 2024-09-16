"use client";
import LeavesTable from "@/components/LeavesTable";
import { PieChart } from "@/components/Piechart";
import TopBar from "@/components/TopBar";
import UserTable from "@/components/UserTable";
import { useGetAllLeavesQuery } from "@/hooks/leave/leaveQueries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import { colorList } from "@/utils/colorlist";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useIsFetching } from "@tanstack/react-query";
import React, { useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";

// eslint-disable-next-line react/display-name
const DashboardPage = React.memo(() => {
  const { getUser } = useKindeBrowserClient();
  const isFetching = useIsFetching();
  const getAllLeaves = useGetAllLeavesQuery();
  const currentUser = useCurrentUserQuery(getUser()?.id, getUser());
  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    currentUser.data?.organization?.id,
  );
  const leaveLabels = useMemo(() => {
    return getLeaveTypes.data?.map((leaveType) => leaveType.leaveName);
  }, [getLeaveTypes.data]);
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
    return countLeaves(leaveLabels || [], getAllLeaves.data?.data || []);
  }, [leaveLabels, getAllLeaves.data?.data]);
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

  const pieChartData = {
    labels: leaveLabels || [],
    datasets: [
      {
        data: filteredLeaveData,
        backgroundColor: backgroundColor || [],
      },
    ],
  };
  // if (isFetching) {
  //   return (
  //     <div className="flex h-full w-full flex-col justify-center dark:bg-darker md:h-screen md:items-center">
  //       <p className="animate-bounce">Loading...</p>
  //     </div>
  //   );
  // }
  return (
    <PageContainer>
      <TopBar>Dashboard</TopBar>
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
                          <div className="w-fit p-4" key={index}>
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
          <div className="w-full space-y-4">
            <h1 className="text-xl">Leaves</h1>
            <LeavesTable getLeaveTypes={getLeaveTypes} isAdmin={true} />
            <h1 className="text-xl">Employees</h1>
            <UserTable organizationId={currentUser.data?.organization?.id!} />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
});

export default DashboardPage;
