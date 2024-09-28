import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { normalizeValue } from "../../utils/helpers";

import { WeatherDataI } from "../../App";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CustomChartI {
  weatherValues: Pick<WeatherDataI, "current">["current"] | undefined;
}

const CustomChart = ({ weatherValues }: CustomChartI) => {
  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const radarData = {
    labels: ["Temperature", "Wind", "Humidity"],
    datasets: [
      {
        data: weatherValues
          ? [
              normalizeValue(weatherValues.temp_c, -10, 40),
              normalizeValue(weatherValues.wind_kph, 0, 100),
              normalizeValue(weatherValues.humidity, 0, 100),
            ]
          : [],
        fill: true,
        backgroundColor: "rgba(34, 202, 236, 0.2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2,
      },
    ],
  };
  return <Radar data={radarData} options={options} />;
};

export default CustomChart;
