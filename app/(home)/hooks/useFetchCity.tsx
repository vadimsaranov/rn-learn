import { City } from '@/core/City';
import { useEffect, useState } from 'react';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const citiesList = [
  'San Jose',
  'London',
  'New York',
  'Paris',
  'Hong Kong',
  'Singapore',
  'Beijing',
  'City of Sydney',
  'Sao Paulo',
];
export default function useFetchCities() {
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState<City[]>([]);

  const fetchCity = async (cityName: string) => {
    try {
      const response = await (
        await fetch(`${BASE_URL}weather?q=${cityName}&appid=${API_KEY}`)
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
      return city;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCities = async () => {
    try {
      setLoading(true);
      const result: City[] = [];
      const promises = citiesList.map(async (cityName) => {
        const city = await fetchCity(cityName);
        if (city) {
          result.push(city);
        }
      });

      await Promise.all(promises);
      setCities(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCityByName = (cityName: string) => {
    const city = cities.find((c) => c.name === cityName);
    return city;
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return { loading, data: cities, getCityByName };
}
