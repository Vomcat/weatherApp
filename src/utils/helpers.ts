const WEATHER_ADRESS_DATA = import.meta.env.VITE_API_WEATHER_API;
const WEATHER_API_KEY = import.meta.env.VITE_API_KEY;

import { WeatherDataI } from "../App";

const getWeatherData = async (location: string): Promise<WeatherDataI> => {
  const data = await fetch(
    `${WEATHER_ADRESS_DATA}${WEATHER_API_KEY}&q=${location}`
  );
  if (!data.ok) {
    throw new Error("Ups! Something went wrong");
  }
  return data.json();
};

const normalizeValue = (value: number, min: number, max: number): number => {
  if (value <= min) return 1;
  if (value >= max) return 10;
  return ((value - min) / (max - min)) * 9 + 1;
};

export { getWeatherData, normalizeValue };
