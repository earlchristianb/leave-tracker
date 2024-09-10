const SectionContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-2 dark:bg-dark xl:p-4">
      <div className="flex h-[95%] w-[95%] flex-col space-y-4 p-2 lg:h-[90%] lg:w-[90%] lg:flex-row xl:h-[80%] xl:w-[80%]">
        {children}
      </div>
    </div>
  );
};

export default SectionContainer;
