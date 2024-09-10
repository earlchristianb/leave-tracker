"use client";
import LeavesTable from "@/components/LeavesTable";
import { PieChart } from "@/components/Piechart";
import TopBar from "@/components/TopBar";
import { useGetLeavesByUserQuery } from "@/hooks/leave/leave.Queries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import { useGetUserQuery } from "@/hooks/user/userQueries";
import { colorList } from "@/utils/colorlist";
import { useIsFetching } from "@tanstack/react-query";
import React, { useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";

function EmployeePage({ userId }: { userId: string }) {
  const isFetching = useIsFetching();
  const employee = useGetUserQuery(userId);
  const leavesByEmployee = useGetLeavesByUserQuery(userId);

  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    employee.data?.organization?.id,
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
    return countLeaves(leaveLabels || [], leavesByEmployee.data || []);
  }, [leaveLabels, leavesByEmployee.data]);
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

  if (isFetching) {
    return (
      <div className="flex h-full w-full flex-col justify-center dark:bg-darker md:h-screen md:items-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  }
  return (
    <PageContainer>
      <TopBar>
        <div className="flex items-center space-x-2">
          <p>{employee.data && employee.data?.name}</p>
          <p className="bg-lighter p-2 text-sm dark:bg-dark">
            {employee.data && employee.data?.team?.name}
          </p>
        </div>
      </TopBar>
      <SectionContainer>
        <div className="h-full w-full space-y-4">
          <div className="flex h-full w-full flex-col space-x-0 space-y-2 lg:h-52 lg:flex-row lg:space-x-2 lg:space-y-0">
            {leaveData && leaveLabels && (
              <div className="flex h-52 w-full justify-center bg-light p-2 shadow dark:bg-darker lg:w-auto">
                <PieChart data={pieChartData} key="piechart1" />
              </div>
            )}
            <div className="flex h-full w-full flex-col items-center justify-center p-2 shadow dark:bg-darker lg:h-52 lg:flex-row">
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
          <div className="min-h-[30%] w-full overflow-x-auto">
            <LeavesTable getLeaves={leavesByEmployee} isAdmin={true} />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

export default EmployeePage;
