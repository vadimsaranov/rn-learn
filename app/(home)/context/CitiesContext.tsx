import { City } from '@/core/City';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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

type CitiesContextType = {
  cities: City[];
  getCityByName: (cityName: string) => City | undefined;
  loading: boolean;
};

export const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  getCityByName: () => undefined,
  loading: false,
});

interface CitiesContextProps {
  children: ReactNode | undefined;
}

export default function CitiesContextProvider({ children }: CitiesContextProps) {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
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

  const getCityByName = useCallback(
    (cityName: string) => {
      const city = cities.find((c) => c.name === cityName);
      return city;
    },
    [cities],
  );

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

  useEffect(() => {
    fetchCities();
  }, []);

  const data = useMemo<CitiesContextType>(() => {
    return { cities, getCityByName, loading };
  }, [cities, getCityByName, loading]);

  return <CitiesContext.Provider value={data}>{children}</CitiesContext.Provider>;
}
