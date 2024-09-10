import DetailsSection from "@/components/DetailsSection";

const LeaveTypesDetails = ({
  abbreviation,
  additionalInfo,
  leaveName,
  leaveDescription,
  monthlyRestriction,
  maxLeavesPerYear,
}: {
  abbreviation?: string;
  leaveName: string;
  leaveDescription: string;
  additionalInfo?: string;
  monthlyRestriction?: number;
  maxLeavesPerYear: number;
}) => {
  return (
    <div className="space-y-4 rounded bg-lighter p-2 text-gray-900 dark:bg-raisin_black-600">
      <DetailsSection label="Name" value={leaveName} />
      <DetailsSection label="Abbreviation" value={abbreviation} />
      <DetailsSection label="Leave Description" value={leaveDescription} />
      <DetailsSection label="Additional Info" value={additionalInfo} />
      <DetailsSection label="Monthly Restriction" value={monthlyRestriction} />
      <DetailsSection label="Max Leaves Per Year" value={maxLeavesPerYear} />
    </div>
  );
};

export default LeaveTypesDetails;
