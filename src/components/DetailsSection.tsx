const DetailsSection = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | undefined;
}) => {
  return (
    <div>
      <label className="text-lg font-medium dark:text-raisin_black-800">
        {label}
      </label>
      <p className="min-h-10 bg-light p-2 dark:bg-dark dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default DetailsSection;
