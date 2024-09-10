import { Leave } from "@/types/leave.type";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import Column from "./Column";

const LeavesTable = ({
  getLeaves,
  isAdmin = false,
}: {
  getLeaves: UseQueryResult<Leave[], Error>;
  isAdmin?: boolean;
}) => {
  return (
    <section className="scrollbar-thin w-screen overflow-x-auto text-left drop-shadow-2xl">
      <div className="w-full">
        <div className="relative w-full divide-gray-500 text-center">
          <div className="flex w-full items-center border-b bg-light dark:bg-darker dark:text-white">
            <div
              className={`relative flex w-auto flex-nowrap bg-light px-4 py-2 text-left text-darkest dark:bg-darker dark:text-white lg:w-full`}
            >
              <p className="w-10 px-2"></p>
              <p className="w-40 min-w-40 lg:w-full">Type of leave</p>
              {isAdmin && <p className="w-40 min-w-40 lg:w-full">Employee</p>}
              <p className="w-40 min-w-40 lg:w-full">Filed Date</p>
              <p className="w-40 min-w-40 lg:w-full">Reason</p>
              <p className="w-40 min-w-40 lg:w-full">Dates</p>
              <p className="w-40 min-w-40 lg:w-full">File link</p>
            </div>
          </div>
          {getLeaves.data &&
            getLeaves.data.length &&
            getLeaves.data.map((leave: Leave, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <div
                className="group flex w-full p-2 text-left transition duration-300 hover:cursor-pointer"
                onDoubleClick={() => {}}
              >
                <p
                  className={`${!(index % 2 == 0) && `bg-transparent`} w-10 px-2 text-left`}
                >
                  {/* {correctIndex} */}
                  {index + 1}
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
            ))}
        </div>
      </div>
    </section>
  );
};

export default LeavesTable;
