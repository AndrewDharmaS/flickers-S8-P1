import axios from "axios";
const WEATHER_API = "55323c84582082191f5c61a44a6abfbc";
const DEFAULT_WEATHER_API_URL = "http://api.openweathermap.org/data/2.5";
const WEATHER_API_URL = "?appid=" + WEATHER_API;
const IPINFO_API = "5e7f57a3bc1fc3";
const DEFAULT_IPINFO_API_URL = "https://ipinfo.io";
const IPINFO_API_URL = "?token=" + IPINFO_API;

const getWeather = async function getWeather(): Promise<any> {
  try {
    const ipinfo_url = DEFAULT_IPINFO_API_URL + IPINFO_API_URL;
    const ipInfoResponse = await axios.get(ipinfo_url);

    const countryCode = ipInfoResponse.data.country;
    const cityCode = ipInfoResponse.data.city;

    const weather_url =
      DEFAULT_WEATHER_API_URL +
      "/weather" +
      WEATHER_API_URL +
      "&q=" +
      cityCode +
      "," +
      countryCode +
      "&mode=xml";
    const weatherResponse = await axios.get(weather_url);

    const weatherData = weatherResponse.data;

    return weatherData;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export default { getWeather };
