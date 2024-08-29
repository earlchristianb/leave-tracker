import ThemeSwitcher from "@/components/ThemeSwitcher";
import Topbar from "@/components/Topbar";
import React from "react";

function DashboardPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center dark:bg-darker">
      <Topbar>Dashboard</Topbar>
      <div className="flex h-[80%] flex-col space-y-4 p-2">
        <div>
          <h1>Welcome to the Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
