import { City } from '@core/City';
import { citiesSelector } from '@store/slices/citiesSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteCity as deleteCityAction,
  updateCities as updateCitiesAction,
} from '@store/slices/citiesSlice';

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

export const IconNamesList = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];

type CitiesContextType = {
  cities: City[];
  getCityById: (cityName: string) => City | undefined;
  loading: boolean;
  loadNextPage: () => void;
  deleteCity: (id: string) => void;
  updateCity: (city: City) => void;
};

export const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  getCityById: () => undefined,
  loading: false,
  loadNextPage: () => {},
  deleteCity: () => {},
  updateCity: () => {},
});

interface CitiesContextProps {
  children: ReactNode | undefined;
}

export default function CitiesContextProvider({ children }: CitiesContextProps) {
  const dispatch = useAppDispatch();
  const { cities: localCities } = useAppSelector(citiesSelector);

  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const getCityById = useCallback(
    (cityId: string) => {
      const allCities = [...cities, ...localCities];
      const city = allCities.find((c) => c.id === cityId);
      return city;
    },
    [cities, localCities],
  );

  const fetchCity = async (cityName: string) => {
    try {
      const res = await fetch(`${BASE_URL}weather?q=${cityName}&appid=${API_KEY}`);

      const result = await res.json();

      const city: City = {
        id: result.id.toString(),
        icon: result.weather[0].icon,
        name: result.name,
        temp: result.main.temp,
        weather: result.weather[0],
        humidity: result.main.humidity,
        pressure: result.main.pressure,
        cloudCover: result.clouds.all,
        wind: result.wind.speed,
      };
      return city;
    } catch {
      throw new Error('City not found');
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const getAllCities = useCallback(
    (page = 1) => {
      const allCities = [...cities, ...localCities];
      return allCities.slice(0, page * 10);
    },
    [cities, localCities],
  );

  const loadNextPage = useCallback(() => {
    const totalPages = Math.ceil((cities.length + localCities.length) / 10);
    const nextPage = currentPage + 1;
    if (nextPage !== totalPages) {
      setCurrentPage(nextPage);
    }
  }, [cities, localCities, currentPage]);

  const deleteCity = useCallback(
    (id: string) => {
      const localCity = localCities.find((city) => city.id === id);
      if (localCity) {
        dispatch(deleteCityAction(id));
      } else {
        const city = cities.find((city) => city.id === id);

        if (city) {
          setCities((prevCities) => prevCities.filter((city) => city.id !== id));
        }
      }
    },
    [cities, dispatch, localCities],
  );

  const updateCity = useCallback(
    (updatedCity: City) => {
      const apiCity = cities.find((city) => city.id === updatedCity.id);

      if (apiCity) {
        const apiCity = cities.find((city) => city.id === updatedCity.id);

        if (apiCity) {
          setCities((prevCities) =>
            prevCities.map((prevCity) => (prevCity.id === updatedCity.id ? updatedCity : prevCity)),
          );
        }
      } else {
        dispatch(updateCitiesAction(updatedCity));
      }
    },
    [cities, dispatch],
  );

  const data = useMemo<CitiesContextType>(() => {
    const allCities = getAllCities(currentPage);

    return { cities: allCities, getCityById, loading, loadNextPage, deleteCity, updateCity };
  }, [getCityById, loading, currentPage, getAllCities, loadNextPage, deleteCity, updateCity]);

  return <CitiesContext.Provider value={data}>{children}</CitiesContext.Provider>;
}
