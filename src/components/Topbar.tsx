import React from "react";

const Topbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-20 w-full items-center border-b p-4 text-xl dark:border-gray-500">
      {children}
    </div>
  );
};

export default Topbar;
