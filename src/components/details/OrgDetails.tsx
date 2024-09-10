import DetailsSection from "@/components/DetailsSection";

const OrgDetails = ({
  name,
  driveLink,
  description,
  inviteCode,
}: {
  name: string;
  description?: string;
  driveLink?: string;
  inviteCode: string;
}) => {
  return (
    <div className="space-y-4 rounded bg-lighter p-2 text-gray-900 dark:bg-raisin_black-600">
      <DetailsSection label="Organization Name" value={name} />
      <DetailsSection label="Drive Link" value={driveLink} />
      <DetailsSection label="Description" value={description} />
      <DetailsSection label="Invite Code" value={inviteCode} />
    </div>
  );
};

export default OrgDetails;
