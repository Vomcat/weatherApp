import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getWeatherData } from "./utils/helpers";

import CustomChart from "./components/Chart/Chart";

export interface WeatherDataI {
  location: {
    name: string;
  };
  current: {
    humidity: number;
    temp_c: number;
    wind_kph: number;
  };
}

interface QueryErrorI {
  message: string;
}

function App() {
  const [location, setLocation] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError, error } = useQuery<
    WeatherDataI,
    QueryErrorI
  >({
    queryKey: ["weather", location],
    queryFn: () => getWeatherData(location),
    enabled: !!location,
    staleTime: 60000,
  });

  useEffect(() => {
    if (data) {
      setCities((prevCities) =>
        prevCities.includes(location)
          ? prevCities
          : [
              ...(prevCities.length >= 4 ? prevCities.slice(1) : prevCities),
              location,
            ]
      );
    }
  }, [data, location]);

  const handleFetchWeather = () => {
    const inputValue = inputRef.current?.value;
    if (inputValue) {
      setLocation(inputValue);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleFetchWeatherFromCity = (city: string) => {
    setLocation(city);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleFetchWeather();
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 flex flex-col justify-center items-center ">
        <div className="w-full flex flex-col max-w-sm min-w-[300px] justify-center items-center gap-3">
          <input
            type="text"
            placeholder="Enter location"
            ref={inputRef}
            className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleFetchWeather}
          >
            Get Weather
          </button>
        </div>

        {isLoading && <p>Loading...</p>}
        {isError && (
          <p>Error: {error.message ? error.message : "Error fetching data"}</p>
        )}
        <div className="w-full lg:w-2/4 flex justify-center">
          <CustomChart weatherValues={data ? data.current : undefined} />
        </div>
        <div className="flex justify-center items-center gap-3 ">
          {cities.map((city, index) => (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              key={index}
              onClick={() => handleFetchWeatherFromCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
