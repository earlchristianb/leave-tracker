"use client";
import LeavesTable from "@/components/LeavesTable";
import TopBar from "@/components/TopBar";
import { useGetLeavesByUserQuery } from "@/hooks/leave/leaveQueries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import { useGetUserQuery } from "@/hooks/user/userQueries";
import React, { useMemo } from "react";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";
import LeavesDataVisualization from "@/components/visualization/LeavesDataVisualization";

function EmployeePage({ userId }: { userId: string }) {
  const employee = useGetUserQuery(userId);
  const leavesByEmployee = useGetLeavesByUserQuery(userId);
  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    employee.data?.organization?.id,
  );
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
          <LeavesDataVisualization
            leaveTypes={getLeaveTypes}
            leaves={leavesByEmployee}
          />
          <div className="min-h-[30%] w-full overflow-x-auto">
            <LeavesTable
              getLeaveTypes={getLeaveTypes}
              userId={userId}
              isAdmin={true}
            />
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

export default EmployeePage;
