"use client";
import { Leave } from "@/types/leave.type";
import React, { memo, useMemo, useState } from "react";
import Column from "./Column";
import Paginate from "@/components/Pagination";
import { useGetLeavesWithPaginationAndFilterQuery } from "@/hooks/leave/leaveQueries";
import { useIsFetching, UseQueryResult } from "@tanstack/react-query";
import { OrgLeaveType } from "@/types/organization.type";
import Button from "@/components/Button";

const resetToFirstPage = 1;

// eslint-disable-next-line react/display-name
const LeavesTable = memo(
  ({
    userId = "",
    isAdmin = false,
    getLeaveTypes,
  }: {
    isAdmin?: boolean;
    userId?: string;
    getLeaveTypes: UseQueryResult<OrgLeaveType[], Error>;
  }) => {
    const isFetching = useIsFetching();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(resetToFirstPage);
    const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
    const handleItemsPerPageChange = (
      e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setItemsPerPage(Number(e.target.value));
    };
    const [leaveTypeId, setSelectedLeaveType] = useState<string>("");

    const getLeavesWithPaginationAndFilter =
      useGetLeavesWithPaginationAndFilterQuery({
        leaveTypeId: leaveTypeId,
        limit: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
        userId: userId,
      });

    const refreshData = () => {
      getLeavesWithPaginationAndFilter.refetch();
    };
    const previousPage = async () => {
      if (currentPage > 1) {
        return setCurrentPage(currentPage - 1);
      }
      setCurrentPage(
        Math.ceil(getLeavesWithPaginationAndFilter.data?.total! / itemsPerPage),
      );
    };
    const nextPage = async () => {
      const lastPage = Math.ceil(
        getLeavesWithPaginationAndFilter.data?.total! / itemsPerPage,
      );
      if (currentPage === lastPage) {
        return setCurrentPage(resetToFirstPage);
      }
      setCurrentPage((prev) => prev + 1);
    };
    const leavesData = useMemo(
      () => getLeavesWithPaginationAndFilter.data?.data || [],
      [getLeavesWithPaginationAndFilter.data?.data],
    );
    const totalItems = getLeavesWithPaginationAndFilter.data?.total || 0;
    return (
      <>
        <section className="scrollbar-thin w-full text-left shadow-xl drop-shadow-2xl">
          <div className="w-full">
            <div className="flex items-center space-x-4">
              {getLeaveTypes.data && getLeaveTypes.data?.length > 0 && (
                <div className="flex w-full flex-row items-center sm:justify-between">
                  <div className="flex items-center justify-start space-x-2 p-2">
                    <label className="w-full">Filter</label>
                    <select
                      onChange={(e) => setSelectedLeaveType(e.target.value)}
                      className="w-40 border-b border-dark p-1 dark:bg-gray-400"
                      value={leaveTypeId}
                      id="searchBar"
                    >
                      <>
                        <option value="">All</option>
                        {getLeaveTypes.data?.map((leaveType) => (
                          <option key={leaveType.id} value={leaveType.id}>
                            {leaveType.leaveName}
                          </option>
                        ))}
                      </>
                    </select>
                  </div>
                  <Button
                    type="button"
                    className="h-10 text-sm"
                    onClick={refreshData}
                  >
                    Refresh
                  </Button>
                </div>
              )}
            </div>
            <div className="relative w-auto divide-gray-500 overflow-x-auto text-center">
              <div className="flex w-full items-center border-b bg-light dark:bg-darker dark:text-white">
                <div
                  className={`relative flex w-auto flex-nowrap bg-light px-4 py-2 text-left text-darkest dark:bg-darker dark:text-white lg:w-full`}
                >
                  <p className="w-10 px-2"></p>
                  <p className="w-40 min-w-40 bg-light text-darkest dark:bg-darker dark:text-white lg:w-full">
                    Type of leave
                  </p>
                  {isAdmin && (
                    <p className="w-40 min-w-40 bg-light text-darkest dark:bg-darker dark:text-white lg:w-full">
                      Employee
                    </p>
                  )}
                  <p className="w-40 min-w-40 bg-light text-darkest dark:bg-darker dark:text-white lg:w-full">
                    Filed Date
                  </p>
                  <p className="w-40 min-w-40 bg-light text-darkest dark:bg-darker dark:text-white lg:w-full">
                    Reason
                  </p>
                  <p className="w-40 min-w-40 bg-light text-darkest dark:bg-darker dark:text-white lg:w-full">
                    Dates
                  </p>
                  <p className="w-40 min-w-40 bg-light text-darkest dark:bg-darker dark:text-white lg:w-full">
                    File link
                  </p>
                </div>
              </div>
              {isFetching ? (
                <div>Loading...</div>
              ) : leavesData && leavesData.length > 0 ? (
                leavesData.map((leave: Leave, index: number) => (
                  // eslint-disable-next-line react/jsx-key
                  <div
                    key={index}
                    className="group flex w-full p-2 text-left transition duration-300 hover:cursor-pointer"
                    onDoubleClick={() => {}}
                  >
                    <p
                      className={`${!(index % 2 == 0) && `bg-transparent`} w-10 px-2 text-left`}
                    >
                      {(currentPage - 1) * itemsPerPage + (index + 1)}
                    </p>
                    <Column>{leave?.leaveType?.leaveName}</Column>
                    {isAdmin && <Column>{leave?.createdBy?.name}</Column>}
                    <Column>
                      {new Date(leave?.created_at).toLocaleDateString()}
                    </Column>
                    <Column> {leave.reason}</Column>
                    <Column>
                      {leave.dates
                        .map((date) => new Date(date).toLocaleDateString())
                        .join(", ")}
                    </Column>
                    <Column additionalClassName="truncate">
                      {leave?.fileLink && (
                        <a
                          href={leave?.fileLink}
                          rel="noreferrer nofollow"
                          target="_blank"
                        >
                          {leave?.fileLink}
                        </a>
                      )}
                    </Column>
                  </div>
                ))
              ) : (
                <div>No Record Found</div>
              )}
            </div>
          </div>
        </section>
        {leavesData &&
          leavesData.length > 0 &&
          getLeavesWithPaginationAndFilter?.data?.total && (
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
  },
);

export default LeavesTable;
