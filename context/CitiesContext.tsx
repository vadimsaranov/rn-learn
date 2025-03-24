import { City } from '@core/City';
import { appDatabase } from '@database/client';
import {
  deleteCityMutation,
  saveCityMutation,
  updateCityMutation,
} from '@database/mutations/cityMutations';
import { getAllCitiesQuery, getCityByIdQuery } from '@database/queries/cityQueries';
import { CityTable, cityTable } from '@database/schemas/cityTable';
import { WeatherTable } from '@database/schemas/weatherTable';
import { count, eq } from 'drizzle-orm';
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

export const IconNamesList = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];

type CitiesContextType = {
  cities: City[];
  favoriteCities: City[];
  getCityById: (cityName: string) => Promise<City | undefined>;
  loading: boolean;
  loadNextPage: () => void;
  deleteCity: (id: string) => void;
  updateCity: (city: City) => void;
  updateCityFavorite: (cityId: string, isFavorite: boolean) => Promise<void>;
};

export const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  favoriteCities: [],
  getCityById: () => Promise.resolve(undefined),
  loading: false,
  loadNextPage: () => {},
  deleteCity: () => {},
  updateCity: () => {},
  updateCityFavorite: () => Promise.resolve(),
});

interface CitiesContextProps {
  children: ReactNode | undefined;
}

export default function CitiesContextProvider({ children }: CitiesContextProps) {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<City[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const saveCity = useCallback(async (city: City) => {
    const existingCity = await getCityByIdQuery(city.id);

    if (existingCity.length > 0) {
      await updateCityMutation(city, existingCity[0].weather_table.id);
    } else {
      await saveCityMutation(city);
    }
  }, []);

  const fetchCity = useCallback(
    async (cityName: string) => {
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

        await saveCity(city);
        return city;
      } catch {
        throw new Error('City not found');
      }
    },
    [saveCity],
  );

  const fetchCities = useCallback(async () => {
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [fetchCity]);

  const cityRemapper = useCallback(
    (dbCity: { city_table: CityTable; weather_table: WeatherTable }) => {
      const { city_table, weather_table } = dbCity;

      return {
        ...city_table,
        id: city_table.id.toString(),
        wind: city_table.wind || undefined,
        cloudCover: city_table.cloudCover || undefined,
        weather: {
          description: weather_table.description,
          icon: weather_table.icon,
          id: weather_table.id,
          main: weather_table.main,
        },
        isFavorite: city_table.isFavorite,
      };
    },
    [],
  );

  const getCityById = useCallback(
    async (cityId: string) => {
      const city = await getCityByIdQuery(cityId);
      return cityRemapper(city[0]);
    },
    [cityRemapper],
  );

  const getAllCities = useCallback(
    async (page = 1) => {
      const dbCities = await getAllCitiesQuery(page);

      if (dbCities.length === 0) {
        return;
      }
      const remappedCities: City[] = dbCities.map(cityRemapper);
      setCities(remappedCities);
    },
    [cityRemapper],
  );

  const getFavoriteCities = useCallback(async () => {
    const dbCities = await getAllCitiesQuery(currentPage, true);

    const remappedCities: City[] = dbCities.map(cityRemapper);

    setFavoriteCities(remappedCities);
  }, [cityRemapper, currentPage]);

  const getAllData = useCallback(
    async (page: number) => {
      await getAllCities(page);
      await getFavoriteCities();
    },
    [getAllCities, getFavoriteCities],
  );

  const loadNextPage = useCallback(async () => {
    const countRows = await appDatabase.select({ count: count() }).from(cityTable);

    const totalPages = Math.ceil(countRows[0].count / 10);
    const nextPage = currentPage + 1;

    if (totalPages > 1 && nextPage !== totalPages) {
      setCurrentPage(nextPage);
    }
  }, [currentPage]);

  const deleteCity = useCallback(
    async (cityId: string) => {
      await deleteCityMutation(cityId);
      getAllData(currentPage);
    },
    [currentPage, getAllData],
  );

  const updateCity = useCallback(
    async (updatedCity: City) => {
      await saveCity(updatedCity);
      await getAllData(currentPage);
    },
    [saveCity, getAllData, currentPage],
  );

  const updateCityFavorite = useCallback(
    async (cityId: string, isFavorite: boolean) => {
      await appDatabase
        .update(cityTable)
        .set({
          isFavorite,
        })
        .where(eq(cityTable.id, cityId));

      await getAllData(currentPage);
    },
    [currentPage, getAllData],
  );

  useEffect(() => {
    fetchCities().then(() => {
      getAllData(currentPage);
    });
  }, [currentPage, fetchCities, getAllData]);

  useEffect(() => {
    getAllCities(currentPage);
  }, [currentPage, getAllCities]);

  const data = useMemo<CitiesContextType>(() => {
    return {
      cities,
      getCityById,
      loading,
      loadNextPage,
      deleteCity,
      updateCity,
      updateCityFavorite,
      favoriteCities,
    };
  }, [
    getCityById,
    loading,
    loadNextPage,
    deleteCity,
    updateCity,
    cities,
    updateCityFavorite,
    favoriteCities,
  ]);

  return <CitiesContext.Provider value={data}>{children}</CitiesContext.Provider>;
}
