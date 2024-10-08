"use client";
import TopBar from "@/components/TopBar";
import {
  useGetOrganizationQuery,
  useGetOrgLeaveTypeQuery,
} from "@/hooks/organization/organizationQueries";
import { useCurrentUserQuery } from "@/hooks/user/userQueries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useIsFetching } from "@tanstack/react-query";
import React from "react";
import PageContainer from "@/components/PageContainer";
import SectionContainer from "@/components/SectionContainer";
import Button from "@/components/Button";
import { useTeamsByOrgQuery } from "@/hooks/team/teamQueries";
import OrgDetails from "@/components/details/OrgDetails";
import TeamDetails from "@/components/details/TeamDetails";
import LeaveTypesDetails from "@/components/details/LeaveTypesDetails";
import UpdateOrganizationForm from "@/components/forms/update/update-organization.form";
import UpdateTeamForm from "@/components/forms/update/update-team.form";
import CreateTeamForm from "@/components/forms/create/create-team.form";
import CreateOrgLeaveTypeForm from "@/components/forms/create/create-leavetype.form";
import UpdateLeaveTypeForm from "@/components/forms/update/update-leavetype.form";

const Tabs = {
  Organization: "Organization",
  Teams: "Teams",
  LeaveTypes: "Leave Types",
} as const;

type TabType = (typeof Tabs)[keyof typeof Tabs];

const HeaderSection = ({ text }: { text: string }) => {
  return <p className="text-xl font-medium">{text}</p>;
};

function SettingsPage() {
  const [currentTab, setCurrentTab] = React.useState<TabType>(
    Tabs.Organization,
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const { getUser } = useKindeBrowserClient();

  const isFetching = useIsFetching();
  const currentUser = useCurrentUserQuery(getUser()?.id, getUser());
  const getLeaveTypes = useGetOrgLeaveTypeQuery(
    currentUser.data?.organization?.id,
  );
  const teamsQuery = useTeamsByOrgQuery(currentUser.data?.organization?.id);
  const orgQuery = useGetOrganizationQuery(currentUser.data?.organization?.id);

  const handleTabChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTab(e.currentTarget.name as TabType);
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    setIsAdding(false);
  };
  const handleToggleAdd = () => {
    setIsAdding((prev) => !prev);
    setIsEditing(false);
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
      <TopBar>Settings</TopBar>
      <SectionContainer>
        <div className="flex w-full flex-col space-y-4">
          <div className="flex w-full items-center justify-between">
            <nav className="flex w-fit rounded bg-light p-1 text-sm font-medium text-black dark:bg-raisin_black-600 dark:text-white">
              <button
                type="button"
                onClick={handleTabChange}
                name="Organization"
                className={`rounded ${currentTab === Tabs.Organization ? "bg-white dark:text-black" : ""} p-1`}
              >
                Organization
              </button>
              <button
                type="button"
                onClick={handleTabChange}
                name="Teams"
                className={`rounded ${currentTab === Tabs.Teams ? "bg-white dark:text-black" : ""} p-1`}
              >
                Teams
              </button>
              <button
                type="button"
                onClick={handleTabChange}
                name="Leave Types"
                className={`rounded ${currentTab === Tabs.LeaveTypes ? "bg-white dark:text-black" : ""} p-1`}
              >
                Leave Types
              </button>
            </nav>
            <div className="space-x-2">
              {(currentTab === Tabs.Teams ||
                currentTab === Tabs.LeaveTypes) && (
                <Button
                  onClick={handleToggleAdd}
                  className={`${isAdding ? "bg-darkest dark:bg-lighter dark:text-darker" : "bg-lighter dark:bg-darkest dark:text-lighter"}`}
                >
                  <p className="flex items-center space-x-2 text-sm">
                    <FontAwesomeIcon icon={faAdd} />
                    <span>Add</span>
                  </p>
                </Button>
              )}

              <Button
                onClick={handleToggleEdit}
                className={`${isEditing ? "bg-darkest dark:bg-lighter dark:text-darker" : "bg-lighter dark:bg-darkest dark:text-lighter"}`}
              >
                <p className="flex items-center space-x-2 text-sm">
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Edit</span>
                </p>
              </Button>
            </div>
          </div>

          {
            // Organization
            currentTab === Tabs.Organization && (
              <>
                {orgQuery.isSuccess &&
                  orgQuery?.data &&
                  (!isEditing ? (
                    <>
                      <HeaderSection text={Tabs.Organization} />
                      <OrgDetails
                        name={orgQuery.data.name}
                        inviteCode={orgQuery.data.inviteCode}
                        driveLink={orgQuery.data.driveLink}
                        description={orgQuery.data.description}
                        key={orgQuery.data.id}
                      />
                    </>
                  ) : (
                    <UpdateOrganizationForm
                      name={orgQuery?.data?.name}
                      inviteCode={orgQuery?.data?.inviteCode}
                      description={orgQuery?.data?.description}
                      id={orgQuery?.data.id}
                      driveLink={orgQuery?.data.driveLink}
                    />
                  ))}
              </>
            )
          }

          {
            // Teams
            currentTab === Tabs.Teams && (
              <>
                {teamsQuery.isSuccess &&
                  currentTab === Tabs.Teams &&
                  teamsQuery?.data &&
                  teamsQuery?.data.length > 0 &&
                  (isEditing ? (
                    <UpdateTeamForm
                      currentUser={currentUser}
                      teamList={teamsQuery.data}
                    />
                  ) : isAdding ? (
                    <CreateTeamForm
                      currentUser={currentUser}
                      teamsQuery={teamsQuery}
                    />
                  ) : (
                    <>
                      <HeaderSection text={Tabs.Teams} />
                      {teamsQuery.data.map((team, index) => (
                        <TeamDetails
                          key={index}
                          name={team.name}
                          description={team.description}
                          abbreviation={team.abbreviation}
                        />
                      ))}
                    </>
                  ))}
              </>
            )
          }
          {currentTab === Tabs.LeaveTypes && (
            <>
              {getLeaveTypes.isSuccess &&
                getLeaveTypes?.data &&
                (isEditing ? (
                  <UpdateLeaveTypeForm
                    currentUser={currentUser}
                    leaveTypeList={getLeaveTypes.data}
                  />
                ) : isAdding ? (
                  <CreateOrgLeaveTypeForm
                    currentUser={currentUser}
                    orgLeaveTypeQuery={getLeaveTypes}
                  />
                ) : (
                  <>
                    <HeaderSection text={Tabs.LeaveTypes} />
                    {getLeaveTypes.data.map((leaveType, index) => (
                      <LeaveTypesDetails
                        leaveName={leaveType.leaveName}
                        leaveDescription={leaveType.leaveDescription}
                        maxLeavesPerYear={leaveType.maxLeavesPerYear}
                        abbreviation={leaveType.abbreviation}
                        monthlyRestriction={leaveType.monthlyRestriction}
                        additionalInfo={leaveType.additionalInfo}
                        key={index}
                      />
                    ))}
                  </>
                ))}
            </>
          )}
        </div>
      </SectionContainer>
    </PageContainer>
  );
}

export default SettingsPage;
