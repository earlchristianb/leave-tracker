import { User } from "@/types/user.type";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import Column from "./Column";
import { useRouter } from "next/navigation";

const UserTable = ({ users }: { users: UseQueryResult<User[], Error> }) => {
  const router = useRouter();
  const handleGoToEmployeeProfile = (userId: string) => {
    // console.log("Go to employee profile");
    router.push("/employee/" + userId);
  };
  return (
    <section className="scrollbar-thin w-screen overflow-x-auto text-left drop-shadow-2xl">
      <div className="w-full">
        <div className="relative w-full divide-gray-500 text-center">
          <div className="flex w-full items-center border-b bg-light dark:bg-darker dark:text-white">
            <div
              className={`relative flex w-full justify-between bg-light px-4 py-2 text-left dark:bg-darker dark:text-white`}
            >
              <p className="w-10 px-2"></p>
              <p className="w-40 lg:w-full">Name</p>
              <p className="w-40 lg:w-full">Email</p>
              <p className="w-40 lg:w-full">Role</p>
              <p className="w-40 lg:w-full">Team</p>
              <p className="w-40 lg:w-full">Date Created</p>
            </div>
          </div>
          {users.data &&
            users.data.length &&
            users.data.map((user: User, index: number) => (
              <div
                key={index}
                className="group flex w-full flex-nowrap p-2 text-left transition duration-300 hover:cursor-pointer"
                onDoubleClick={() => {
                  handleGoToEmployeeProfile(user.id);
                }}
              >
                <p
                  className={`${!(index % 2 == 0) && `bg-transparent`} w-10 px-2 text-left`}
                >
                  {/* {correctIndex} */}
                  {index + 1}
                </p>
                <Column>{user?.name}</Column>
                <Column>{user?.email}</Column>
                <Column>{user.role}</Column>
                <Column>{user.team?.name}</Column>
                <Column>
                  {new Date(user?.createdAt).toLocaleDateString()}
                </Column>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default UserTable;
