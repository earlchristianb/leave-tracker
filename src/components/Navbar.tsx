import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import NavLink from "./Link";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faDashboard,
  faHome,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = async () => {
  const { getPermission, isAuthenticated } = getKindeServerSession();
  const isAdmin = await getPermission("is:admin");
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return null;
  }
  return (
    <nav className="flex h-auto w-full bg-lighter text-black shadow-2xl dark:border-0 dark:bg-darker dark:text-lighter md:w-auto md:items-center">
      <div className="flex h-[80%] w-[90%] flex-col items-start justify-start space-y-2 rounded-md p-2 md:hidden md:items-center md:justify-between md:p-4">
        <ul className="flex flex-wrap">
          <NavLink className="w-fit px-1" href="/">
            <p className="flex space-x-2">
              <FontAwesomeIcon icon={faHome} className="text-xl" />
              <span>Home</span>
            </p>
          </NavLink>
          {isAdmin?.isGranted && (
            <>
              <NavLink className="w-fit" href="/dashboard">
                <p className="flex space-x-2">
                  <FontAwesomeIcon icon={faDashboard} className="text-xl" />
                  <span>Dashboard</span>
                </p>
              </NavLink>
              <NavLink className="w-fit" href="/settings">
                <p className="flex space-x-2">
                  <FontAwesomeIcon icon={faCog} className="text-xl" />
                  <span>Settings</span>
                </p>
              </NavLink>
            </>
          )}
          <LogoutLink>
            <Button type="button" className="h-10">
              <FontAwesomeIcon icon={faSignOut} />
            </Button>
          </LogoutLink>
        </ul>
        <div className="flex">
          <div>
            <ThemeSwitcher />
          </div>
          <div></div>
        </div>
      </div>
      <div className="hidden h-[80%] w-full flex-col items-start justify-start rounded-md p-2 md:flex md:items-center md:justify-between md:p-4">
        <ul className="w-full p-2 md:p-4">
          <NavLink className="w-full" href="/">
            <p className="flex space-x-2">
              <FontAwesomeIcon icon={faHome} className="text-xl" />
              <span>Home</span>
            </p>
          </NavLink>
          {isAdmin?.isGranted && (
            <>
              <NavLink className="w-full" href="/dashboard">
                <p className="flex space-x-2">
                  <FontAwesomeIcon icon={faDashboard} className="text-xl" />
                  <span>Dashboard</span>
                </p>
              </NavLink>
              <NavLink className="w-full" href="/settings">
                <p className="flex space-x-2">
                  <FontAwesomeIcon icon={faCog} className="text-xl" />
                  <span>Settings</span>
                </p>
              </NavLink>
            </>
          )}
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
