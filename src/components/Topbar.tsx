import React from "react";

const Topbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:text-lighter dark:bg-darkest flex h-20 w-full items-center bg-white p-4 text-xl">
      {children}
    </div>
  );
};

export default Topbar;
