const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-auto min-h-full w-full flex-col items-center bg-white dark:bg-dark">
      {children}
    </div>
  );
};

export default PageContainer;
