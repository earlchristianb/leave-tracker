"use client";
import Button from "@/components/Button";
import CreateOrganizationForm from "@/components/forms/create/create-organization.form";
import ProfileForm from "@/components/forms/create/profile.form";
import TopBar from "@/components/TopBar";
import { UserRole } from "@/enums";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import {
  useGetOrgLeaveTypeQuery,
  useOrganizationsQuery,
} from "@/hooks/organization/organizationQueries";
import { useTeamsByOrgQuery } from "@/hooks/team/teamQueries";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useIsFetching } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateTeamForm from "@/components/forms/create/create-team.form";
import { useCreateToast } from "@/providers/ToastProvider";
import JoinTeamForm from "@/components/forms/update/join-team.form";
import CreateOrgLeaveTypeForm from "@/components/forms/create/create-leavetype.form";
import JoinOrganizationForm from "@/components/forms/update/join-organization.form";

enum Tabs {
  Profile = "Profile",
  Organization = "Organization",
  Team = "Team",
}

type Tab = keyof typeof Tabs;

function OnboardingPage() {
  const router = useRouter();
  const createToast = useCreateToast();
  const { getUser, getPermission, getAccessTokenRaw } = useKindeBrowserClient();
  console.log("User", getAccessTokenRaw());
  const [selectedOrg, setSelectedOrg] = React.useState<string>("");
  const [currentTab, setCurrentTab] = useState<Tab>(Tabs.Profile);
  const [organizationForm, setOrganizationForm] = useState({
    name: "",
    driveLink: "",
    inviteCode: "",
    description: "",
  });
  const isFetching = useIsFetching();
  const organizationsQuery = useOrganizationsQuery();
  const currentUser = useCurrentUserQuery(getUser()?.id, getUser());
  const orgLeaveTypeQuery = useGetOrgLeaveTypeQuery(
    currentUser.data?.organization?.id,
  );
  const teamsQuery = useTeamsByOrgQuery(currentUser.data?.organization?.id);

  useEffect(() => {
    if (currentUser.data?.id) {
      setCurrentTab(Tabs.Organization);
    }
    if (
      currentUser.data?.organization?.id &&
      currentUser.data.role !== UserRole.ADMIN
    ) {
      setCurrentTab(Tabs.Team);
    }
  }, [
    currentUser.data?.id,
    currentUser.data?.organization?.id,
    currentUser.data?.team?.id,
  ]);

  useEffect(() => {
    if (currentUser.data?.accountSetup) {
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    }
  }, [currentUser.data?.accountSetup]);

  let userHasOrganizationAndAnAdmin =
    currentUser.data &&
    currentUser.data?.organization &&
    currentUser.data?.role === UserRole.ADMIN;
  let teamsAreCreated = teamsQuery.data && teamsQuery.data.length > 0;
  let currentUserIsAnAdmin =
    currentUser.data && currentUser.data?.role === UserRole.ADMIN;
  let currentUserHasTeam = currentUser.data && currentUser.data?.team;
  let organizationsAreCreated =
    organizationsQuery.data && organizationsQuery.data.length > 0;

  const handleGoToTeamSection = () => {
    setCurrentTab(Tabs.Team);
  };

  if (isFetching) {
    return (
      <div className="flex h-full w-full flex-col justify-center dark:bg-darker md:h-screen md:items-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col dark:bg-darkest md:h-screen">
      <TopBar>New User Onboarding</TopBar>
      <div className="flex h-full w-full flex-col items-center justify-center dark:bg-dark">
        <div className="flex h-[90%] w-full flex-col justify-center space-y-4 p-2 xl:w-[80%]">
          {currentUser.data?.accountSetup ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <p className="h-40 text-wrap font-bold">
                Thank you for completing the onboarding process!
                <br /> Redirecting you now to the homepage
              </p>
              <span className="animate-bounce">...</span>
            </div>
          ) : (
            <>
              <p className="space-x-2">
                {Object.values(Tabs).map((tab) => (
                  <span
                    key={tab}
                    className={`cursor-pointer ${
                      currentTab === tab
                        ? "font-bold text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {tab} {">"}
                  </span>
                ))}
              </p>
              {currentTab === Tabs.Profile && <ProfileForm />}
              {currentTab === Tabs.Organization && (
                <>
                  {!organizationsAreCreated &&
                    currentUser.data?.role === UserRole.ADMIN && (
                      <CreateOrganizationForm />
                    )}
                  {userHasOrganizationAndAnAdmin && (
                    <>
                      <CreateOrgLeaveTypeForm
                        currentUser={currentUser}
                        orgLeaveTypeQuery={orgLeaveTypeQuery}
                        showHint={true}
                      />
                      <Button onClick={handleGoToTeamSection}>
                        Go to Team section
                      </Button>
                    </>
                  )}
                  {!currentUser.data?.organization?.id &&
                    organizationsAreCreated && <JoinOrganizationForm />}
                </>
              )}
              {currentTab === Tabs.Team && (
                <>
                  {userHasOrganizationAndAnAdmin && (
                    <CreateTeamForm
                      currentUser={currentUser}
                      teamsQuery={teamsQuery}
                      showHint={true}
                    />
                  )}
                  {!currentUserHasTeam && (
                    <JoinTeamForm
                      currentUser={currentUser}
                      teamsQuery={teamsQuery}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
