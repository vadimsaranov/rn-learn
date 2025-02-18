import { City } from '../core/City';
import { useEffect, useState } from 'react';

export const useFetchCity = (cityName: string) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<City | undefined>();

  const fetchCity = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    try {
      setLoading(true);
      const response = await (
        await fetch(`${baseUrl}weather?q=${cityName}&appid=${apiKey}`)
      ).json();
      const city: City = {
        icon: response.weather[0].icon,
        name: response.name,
        temp: response.main.temp,
        weather: response.weather[0],
        humidity: response.main.humidity,
        pressure: response.main.pressure,
        cloudCover: response.clouds.all,
        wind: response.wind.speed,
      };
      setData(city);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCity();
  }, []);

  return { loading, data };
};
