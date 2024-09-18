"use client";
import LeavesTable from "@/components/LeavesTable";
import TopBar from "@/components/TopBar";
import UserTable from "@/components/UserTable";
import { useGetAllLeavesQuery } from "@/hooks/leave/leaveQueries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useIsFetching } from "@tanstack/react-query";
import React from "react";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";
import LeavesDataVisualization from "@/components/visualization/LeavesDataVisualization";

// eslint-disable-next-line react/display-name
const DashboardPage = React.memo(() => {
  const { getUser } = useKindeBrowserClient();
  const isFetching = useIsFetching();
  const getAllLeaves = useGetAllLeavesQuery();
  const currentUser = useCurrentUserQuery(getUser()?.id, getUser());
  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    currentUser.data?.organization?.id,
  );

  return (
    <PageContainer>
      <TopBar>Dashboard</TopBar>
      <SectionContainer>
        <div className="w-full space-y-4">
          <LeavesDataVisualization
            leaveTypes={getLeaveTypes}
            leaves={getAllLeaves}
          />
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
