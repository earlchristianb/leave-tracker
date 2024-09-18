import { useAddTeamMutation } from "@/hooks/team/teamQueries";
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
};
const CreateTeamForm = ({
  currentUser,
  teamsQuery,
  showHint = false,
}: {
  currentUser: UseQueryResult<User, Error>;
  teamsQuery: UseQueryResult<Team[], Error>;
  showHint?: boolean;
}) => {
  const [teamForm, setTeamForm] = useState(teamEmptyState);
  const createToast = useCreateToast();
  const addTeam = useAddTeamMutation();
  const handleTeamFormChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("Form state", teamForm);
        console.log("submitting");
        try {
          const addTeamRes = await addTeam.mutateAsync({
            organizationId: currentUser.data?.organization?.id,
            teamData: teamForm,
          });
          setTeamForm(teamEmptyState);
          createToast(ToastType.SUCCESS, ToastMessages.TEAM.SUCCESS_CREATE);
          console.log("Response AFTER ADDING TEAM", addTeamRes);
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
      <h1 className="text-xl">Create teams for the organization</h1>
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
      {teamsQuery.data &&
        (teamsQuery.data.length > 0 ? (
          <p className="flex flex-wrap items-center space-x-2 md:flex-nowrap">
            <span> Teams created:</span>
            {teamsQuery.data.map((team: Team) => (
              <span key={team.id} className="rounded bg-light p-2 dark:bg-dark">
                {team.name}
              </span>
            ))}
            {showHint && (
              <span className="animate-bounce font-semibold">
                You can create more teams before joining a team
              </span>
            )}
          </p>
        ) : (
          <div>No Team created yet</div>
        ))}
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default CreateTeamForm;
