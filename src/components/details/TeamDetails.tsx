import DetailsSection from "@/components/DetailsSection";

const TeamDetails = ({
  name,
  description,
  abbreviation,
}: {
  name: string;
  description: string;
  abbreviation: string;
}) => {
  return (
    <div className="space-y-4 rounded bg-lighter p-2 text-gray-900 dark:bg-raisin_black-600">
      <DetailsSection label="Name" value={name} />
      <DetailsSection label="Description" value={description} />
      <DetailsSection label="Abbreviation" value={abbreviation} />
    </div>
  );
};

export default TeamDetails;
