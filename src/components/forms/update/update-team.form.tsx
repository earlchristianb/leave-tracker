import { useUpdateTeamMutation } from "@/hooks/team/teamQueries";
import { Team } from "@/types/team.type";
import { User } from "@/types/user.type";
import { UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import Button from "../../Button";
import Input from "../../Input";
import { useCreateToast } from "@/providers/ToastProvider";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import Form from "../../Form";

const teamEmptyState = {
  name: "",
  description: "",
  abbreviation: "",
  isActive: true,
  organizationId: "",
  createdAt: "",
  updatedAt: "",
  id: "",
  users: [],
} as Team;
const UpdateTeamForm = ({
  currentUser,
  teamList,
}: {
  currentUser: UseQueryResult<User, Error>;
  teamList: Team[];
}) => {
  // const [teams, setTeams] = useState<Team[]>(teamList);
  const [teamForm, setTeamForm] = useState(teamList[0] ?? teamEmptyState);
  const [selectedTeam, setSelectedTeam] = useState<string>(
    teamList.length ? teamList[0].id : "",
  );
  const createToast = useCreateToast();
  const updateTeam = useUpdateTeamMutation();
  const handleTeamFormChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSelectedTeamChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTeam(e.target.value);
    setTeamForm(
      teamList.find((team) => team.id === e.target.value) || teamEmptyState,
    );
  };
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("Form state", teamForm);
        console.log("submitting");
        try {
          const { name, abbreviation, description } = teamForm;
          const updateTeamRes = await updateTeam.mutateAsync({
            organizationId: currentUser.data?.organization?.id!,
            body: { name, abbreviation, description },
            id: selectedTeam,
          });
          console.log("Response AFTER ADDING TEAM", updateTeamRes);

          createToast(ToastType.SUCCESS, ToastMessages.TEAM.SUCCESS_UPDATE);
          console.log("Response AFTER ADDING TEAM", updateTeamRes);
        } catch (error: any) {
          createToast(
            ToastType.ERROR,
            Array.isArray(error?.response.data.message)
              ? error.response.data.message[0]
              : error.response.data.message,
          );
        }
      }}
    >
      <h1 className="text-xl">Update Team</h1>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Select Team</label>
        <select
          className="w-full border-b border-darker p-1 dark:bg-gray-400"
          value={selectedTeam}
          onChange={handleSelectedTeamChange}
        >
          {teamList.map((team: Team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Name*</label>
        <Input
          name="name"
          value={teamForm.name}
          onChange={handleTeamFormChanges}
          type="text"
          required
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Description</label>
        <Input
          name="description"
          value={teamForm.description}
          onChange={handleTeamFormChanges}
          type="text"
        />
      </div>
      <div className="flex flex-col justify-start space-y-2 p-2">
        <label>Abbreviation*</label>
        <Input
          name="abbreviation"
          value={teamForm.abbreviation}
          required
          onChange={handleTeamFormChanges}
          type="text"
        />
      </div>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default UpdateTeamForm;
