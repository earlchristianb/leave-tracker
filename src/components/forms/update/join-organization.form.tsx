import React from "react";
import Form from "../../Form";
import Input from "../../Input";
import { ToastMessages, ToastType } from "@/constants/toast.constants";
import { useCreateToast } from "@/providers/ToastProvider";
import { useJoinOrgMutation } from "@/hooks/organization/organizationQueries";
import Button from "../../Button";

const JoinOrganizationForm = () => {
  const [inviteCode, setInviteCode] = React.useState("");
  const createToast = useCreateToast();
  const joinOrg = useJoinOrgMutation();
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("Form state", inviteCode);
        console.log("submitting");
        try {
          const resp = await joinOrg.mutateAsync({
            inviteCode: inviteCode,
          });
          createToast(ToastType.SUCCESS, ToastMessages.TEAM.SUCCESS_JOIN);
          console.log("Response AFTER JOINING AN ORG", resp);
        } catch (error) {
          console.log("Error", error);
          createToast(ToastType.ERROR, ToastMessages.TEAM.ERROR_JOIN);
        }
      }}
    >
      <h1 className="text-xl">Join an Organization</h1>
      <div className="flex flex-col justify-start space-y-4 p-2">
        <label>Invite Code*</label>
        <Input
          onChange={(e) => {
            setInviteCode(e.target.value);
          }}
          type="text"
          minLength={5}
          maxLength={10}
        />
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default JoinOrganizationForm;
