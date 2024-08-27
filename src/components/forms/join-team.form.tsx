import {
  useJoinTeamMutation,
  useTeamsByOrgQuery,
} from "@/hooks/team/teamQueries";
import React, { FormEvent, ReactElement } from "react";
import { Team } from "@/types/team.type";
import { UseQueryResult } from "@tanstack/react-query";
import { User } from "@/types/user.type";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import { useCreateToast } from "@/providers/ToastProvider";
import Button from "../Button";
import Form from "../Form";
const JoinTeamForm = ({
  currentUser,
  teamsQuery,
}: {
  currentUser: UseQueryResult<User, Error>;
  teamsQuery: UseQueryResult<Team[], Error>;
}) => {
  const [selectedTeam, setSelectedTeam] = React.useState<string>(
    teamsQuery.data?.length ? teamsQuery.data[0].id : "",
  );
  const joinTeam = useJoinTeamMutation();
  const createToast = useCreateToast();

  const handleSelectedTeamChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTeam(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form state", selectedTeam);
    console.log("submitting");
    try {
      const res = await joinTeam.mutateAsync({
        teamId: selectedTeam,
        body: { userId: currentUser.data?.id! },
      });
      console.log("Response AFTER ADDING TEAM", res);
      createToast(ToastType.SUCCESS, ToastMessages.TEAM.SUCCESS_JOIN);
    } catch (error) {
      console.log("Error", error);
      createToast(ToastType.ERROR, ToastMessages.TEAM.ERROR_JOIN);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <h1 className="text-xl">Join a team to finish the onboarding process</h1>
      <div className="flex flex-col justify-start space-y-4 p-2">
        <label>Name*</label>
        <select
          onChange={handleSelectedTeamChange}
          className="w-full border-b border-dark p-1 dark:bg-gray-400"
          value={selectedTeam}
        >
          {teamsQuery.data &&
            teamsQuery.data.length &&
            teamsQuery.data.map((team: Team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
        </select>
      </div>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default JoinTeamForm;
