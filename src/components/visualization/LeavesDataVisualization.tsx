import { colorList } from "@/utils/colorlist";
import { useMemo } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { OrgLeaveType } from "@/types/organization.type";
import { Leave } from "@/types/leave.type";
import { PieChart } from "@/components/Piechart";

const LeavesDataVisualization = ({
  leaveTypes,
  leaves,
}: {
  leaveTypes: UseQueryResult<OrgLeaveType[], Error>;
  leaves: UseQueryResult<{ data: Leave[]; total: number }, Error>;
}) => {
  const currentYear = new Date().getFullYear();
  const leaveLabels = useMemo(() => {
    return leaveTypes.data?.map((leaveType) => leaveType.leaveName);
  }, [leaveTypes.data]);
  const countLeaves = (leaveLabels: string[], leaves: any[]) => {
    return leaveLabels?.map((leaveLabel) => {
      return leaves
        ?.filter((leave) => leave.leaveType.leaveName === leaveLabel)
        .map((leave) => leave.dates)
        .flat();
    });
  };

  const countCurrentYearLeaves = (leaveData: any[], currentYear: number) => {
    return leaveData.map((dates) => {
      return (
        dates?.filter(
          (date: string) => new Date(date).getFullYear() === currentYear,
        ).length || 0
      );
    });
  };

  const leaveData = useMemo(() => {
    return countLeaves(leaveLabels || [], leaves.data?.data || []);
  }, [leaveLabels, leaves.data?.data]);
  const filteredLeaveData = useMemo(() => {
    return (leaveData || []).map((data) => (data ? data.length : 0));
  }, [leaveData]);

  const currentYearLeaveCounts = useMemo(() => {
    return countCurrentYearLeaves(leaveData, currentYear);
  }, [leaveData, currentYear]);
  const leaveDataLength = useMemo(() => {
    return leaveData?.flatMap((data) => data).length;
  }, [leaveData]);
  console.log("leaveDataLength", leaveDataLength);
  const backgroundColor = useMemo(() => {
    return colorList.slice(0, leaveLabels?.length);
  }, [leaveLabels?.length]);

  console.log("leaveData", leaveData);

  const pieChartData = {
    labels: leaveLabels || [],
    datasets: [
      {
        data: filteredLeaveData,
        backgroundColor: backgroundColor || [],
      },
    ],
  };
  return (
    <div className="flex h-full w-full flex-col space-x-0 space-y-2 lg:h-52 lg:flex-row lg:space-x-2 lg:space-y-0">
      {leaveData && leaveLabels && (
        <div className="flex h-52 w-full justify-center bg-light p-2 shadow dark:bg-darker lg:w-auto">
          <PieChart data={pieChartData} key="piechart1" />
        </div>
      )}
      <div className="flex h-full w-full flex-col items-center justify-center p-2 shadow dark:bg-darker lg:h-52 lg:flex-row">
        <div className="w-full p-4 text-center">
          <p className="w-full text-xl font-bold">Total Leaves</p>
          <div className="h-full p-4">
            <p className="">Leaves</p>
            <p className="text-xl">{leaveDataLength}</p>
          </div>
        </div>

        {currentYearLeaveCounts && leaveLabels && (
          <div className="flex h-full w-full flex-col items-center justify-center lg:flex-row">
            <div className="w-full p-4">
              <p className="text-center text-xl font-bold">Current Year</p>
              <div className="flex h-full w-full flex-col items-center justify-center lg:flex-row">
                <div className="w-fit p-4">
                  <p>Leaves</p>
                  <p className="text-center text-xl">
                    {currentYearLeaveCounts.reduce(
                      (sum, count) => sum + count,
                      0,
                    )}
                  </p>
                </div>
                {currentYearLeaveCounts &&
                  leaveLabels &&
                  leaveLabels.map((labels, index) => (
                    <div className="w-fit p-4" key={index}>
                      <p className="text-nowrap">{labels}</p>
                      <p className="text-center">
                        {currentYearLeaveCounts[index]}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesDataVisualization;
