"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import TopBar from "../TopBar";
import Image from "next/image";
import { useGetLeavesByUserQuery } from "@/hooks/leave/leaveQueries";
import { useGetOrgLeaveTypeQuery } from "@/hooks/organization/organizationQueries";
import { useCreateToast } from "@/providers/ToastProvider";
import LeavesTable from "../LeavesTable";
import CreateLeaveForm from "../forms/create/create-leave.form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { colorList } from "@/utils/colorlist";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";
import LeavesDataVisualization from "@/components/visualization/LeavesDataVisualization";

const Tabs = {
  Leaves: "Leaves",
  CreateLeaves: "Create Leaves",
} as const;
type TabType = (typeof Tabs)[keyof typeof Tabs];
const Homepage = ({ userId }: { userId: string }) => {
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
          <LeavesDataVisualization
            leaveTypes={getLeaveTypes}
            leaves={getLeavesByUser}
          />
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
          <div className="w-full overflow-x-auto">
            {currentTab === "Leaves" ? (
              <LeavesTable
                getLeaveTypes={getLeaveTypes}
                userId={userId}
                isAdmin={false}
              />
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
