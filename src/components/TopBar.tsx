import React from "react";

const TopBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sticky right-0 top-0 flex h-20 w-full items-center bg-light p-4 text-xl shadow-2xl dark:bg-raisin_black-600 dark:text-lighter">
      {children}
    </div>
  );
};

export default TopBar;
