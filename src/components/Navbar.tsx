import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import NavLink from "./Link";
import Button from "./Button";

const Navbar = async () => {
  const { getPermission, isAuthenticated } = getKindeServerSession();
  const isAdmin = await getPermission("is:admin");
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return null;
  }
  return (
    <nav className="flex h-auto w-full border border-l dark:border-0 dark:bg-dark md:w-auto md:items-center">
      <div className="flex h-[80%] w-full flex-col items-start justify-start rounded-md p-2 md:items-center md:justify-between md:p-4">
        <ul className="w-full space-y-2 p-2 md:p-4">
          <NavLink className="w-full" href="/">
            Home
          </NavLink>
          {isAdmin && <NavLink href="/dashboard">Dashboard</NavLink>}
        </ul>

        <div className="flex flex-col justify-end space-y-2">
          <ThemeSwitcher />
          <LogoutLink>
            <Button type="button">Logout</Button>
          </LogoutLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
