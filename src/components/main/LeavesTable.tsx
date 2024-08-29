import { Leave } from "@/types/leave.type";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";

const LeavesTable = ({
  getLeavesByUser,
}: {
  getLeavesByUser: UseQueryResult<Leave[], Error>;
}) => {
  return (
    <section className="scrollbar-thin w-full text-left drop-shadow-2xl">
      <div className="w-full">
        <div className="relative w-full divide-gray-500 truncate text-center">
          <div className="flex items-center border-b bg-light dark:bg-darker dark:text-white">
            <p className="w-10 p-2"></p>
            <div
              className={`relative grid w-full grid-cols-2 place-items-center px-4 py-2 text-left md:grid-cols-4 lg:grid-cols-5`}
            >
              <p className="w-full">Type of leave</p>
              <p className="hidden w-full md:block">Filed Date</p>
              <p className="w-full">Dates</p>
              <p className="hidden w-full lg:block">Reason</p>
              <p className="hidden w-full md:block">File link</p>
            </div>
          </div>
          {getLeavesByUser.data &&
            getLeavesByUser.data.length &&
            getLeavesByUser.data.map((leave: Leave, index: number) => (
              <div
                className="flex w-full items-center transition duration-300 hover:cursor-pointer hover:bg-slate-100"
                onDoubleClick={() => {}}
              >
                <p
                  className={`${!(index % 2 == 0) && `bg-transparent`} w-10 p-2`}
                >
                  {/* {correctIndex} */}
                  {index + 1}
                </p>
                <div
                  key={index + 1}
                  className={`relative grid w-full grid-cols-2 place-items-center p-2 text-left md:grid-cols-4 lg:grid-cols-5 ${
                    !(index % 2 == 0) && "bg-transparent"
                  }`}
                >
                  <p className="w-full">{leave?.leaveType?.leaveName}</p>
                  <p className="hidden w-full md:block">
                    {new Date(leave?.created_at).toLocaleDateString()}
                  </p>
                  <p className="hidden w-full lg:block">{leave.reason}</p>
                  <p className="w-full">
                    {leave.dates
                      .map((date) => new Date(date).toLocaleDateString())
                      .join(", ")}
                  </p>
                  <p className="hidden w-full md:block">{leave?.fileLink}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default LeavesTable;
