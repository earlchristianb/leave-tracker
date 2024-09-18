import { User } from "@/types/user.type";
import { useIsFetching } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import Column from "./Column";
import { useRouter } from "next/navigation";
import Paginate from "@/components/Pagination";
import { useGetAllUserByOrgQuery } from "@/hooks/user/userQueries";
import Input from "@/components/Input";
import Button from "@/components/Button";

const resetToFirstPage = 1;
const UserTable = ({ organizationId }: { organizationId: string }) => {
  const router = useRouter();
  const isFetching = useIsFetching();
  const handleGoToEmployeeProfile = (userId: string) => {
    window.open("/employee/" + userId, "_blank");
  };
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(resetToFirstPage);
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const [search, setSearch] = useState("");
  const users = useGetAllUserByOrgQuery(
    organizationId,
    (currentPage - 1) * itemsPerPage,
    itemsPerPage,
    search,
  );
  const handleSubmit = () => {
    const searchBar = document.getElementById("searchBar") as HTMLInputElement;
    setSearch(searchBar.value);
  };
  const previousPage = async () => {
    if (currentPage > 1) {
      return setCurrentPage(currentPage - 1);
    }
    setCurrentPage(Math.ceil(users.data?.total! / itemsPerPage));
  };
  const nextPage = async () => {
    const lastPage = Math.ceil(users.data?.total! / itemsPerPage);
    if (currentPage === lastPage) {
      return setCurrentPage(resetToFirstPage);
    }
    setCurrentPage((prev) => prev + 1);
  };
  const usersData = useMemo(() => users.data?.data || [], [users.data?.data]);
  const totalItems = users.data?.total || 0;

  return (
    <>
      <section className="scrollbar-thin w-full text-left shadow-xl drop-shadow-2xl">
        <div className="w-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-start space-x-2 p-2">
              <label>Search</label>
              <Input
                className="w-32 border-b border-dark p-1 dark:bg-gray-400 sm:w-40"
                type="text"
                id="searchBar"
              />
            </div>
            <Button className="h-10 text-sm" onClick={handleSubmit}>
              Search
            </Button>
          </div>

          <div className="relative w-auto divide-gray-500 overflow-x-auto text-center">
            <div className="flex w-full items-center border-b bg-light dark:bg-darker dark:text-white">
              <div
                className={`relative flex w-auto flex-nowrap bg-light px-4 py-2 text-left text-darkest dark:bg-darker dark:text-white lg:w-full`}
              >
                <p className="w-10 px-2"></p>
                <p className="w-40 lg:w-full">Name</p>
                <p className="w-40 lg:w-full">Email</p>
                <p className="w-40 lg:w-full">Role</p>
                <p className="w-40 lg:w-full">Team</p>
                <p className="w-40 lg:w-full">Date Created</p>
              </div>
            </div>
            {isFetching ? (
              <div>Loading...</div>
            ) : (
              users.data?.data &&
              users.data?.data?.length &&
              users.data?.data?.map((user: User, index: number) => (
                <div
                  className="group flex w-full p-2 text-left transition duration-300 hover:cursor-pointer"
                  onDoubleClick={() => {
                    handleGoToEmployeeProfile(user.id);
                  }}
                  key={index}
                >
                  <p
                    className={`${!(index % 2 == 0) && `bg-transparent`} w-10 px-2 text-left group-hover:bg-light group-hover:text-white group-hover:dark:bg-slate-100 group-hover:dark:text-darker`}
                  >
                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                  </p>
                  <Column>{user?.name}</Column>
                  <Column additionalClassName="truncate">{user?.email}</Column>
                  <Column>{user.role}</Column>
                  <Column>{user.team?.name}</Column>
                  <Column>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Column>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {usersData && usersData.length > 0 && users?.data?.total && (
        <Paginate
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          paginate={paginate}
          previousPage={previousPage}
          nextPage={nextPage}
          currentPage={currentPage}
        />
      )}
    </>
  );
};

export default UserTable;
