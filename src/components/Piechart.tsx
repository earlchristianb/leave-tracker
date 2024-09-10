import { Pie } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";

type chartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
};

ChartJS.register(Tooltip, Legend, ArcElement);

export const PieChart = ({ data }: { data: chartData }) => {
  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white", // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: "Total Leaves",
      },
    },
  };
  return <Pie data={data} options={options} />;
};
