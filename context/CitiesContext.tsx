import { City } from '@core/City';
import { CityTable, cityTable } from '@database/cityTable';
import { WeatherTable, weatherTable } from '@database/weatherTable';
import { count, eq } from 'drizzle-orm';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { appDatabase } from '../app/_layout';

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
  }, []);

  const getCityById = useCallback(async (cityId: string) => {
    const city = await appDatabase
      .select()
      .from(cityTable)
      .where(eq(cityTable.id, cityId))
      .innerJoin(weatherTable, eq(cityTable.weather_id, weatherTable.id));

    return cityRemapper(city[0]);
  }, []);

  const saveCity = useCallback(async (city: City) => {
    const existingCity = await appDatabase
      .select()
      .from(cityTable)
      .where(eq(cityTable.id, city.id));

    if (existingCity.length > 0) {
      await appDatabase
        .update(cityTable)
        .set({
          cloudCover: city.cloudCover,
          wind: city.wind,
          humidity: city.humidity,
          pressure: city.pressure,
          temp: city.temp,
          icon: city.icon,
          name: city.name,
          weather_id: existingCity[0].weather_id,
          isFavorite: city.isFavorite,
        })
        .where(eq(cityTable.id, city.id));
      await appDatabase
        .update(weatherTable)
        .set({
          description: city.weather.description,
          icon: city.icon,
          main: city.weather.main,
        })
        .where(eq(weatherTable.id, city.weather.id));
    } else {
      const weatherData = await appDatabase.insert(weatherTable).values({
        description: city.weather.description,
        icon: city.icon,
        main: city.weather.main,
      });

      await appDatabase.insert(cityTable).values({
        id: city.id,
        name: city.name,
        temp: city.temp,
        icon: city.icon,
        humidity: city.humidity,
        pressure: city.pressure,
        wind: city.wind,
        cloudCover: city.cloudCover,
        weather_id: weatherData.lastInsertRowId,
      });
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

  const getAllCities = useCallback(
    async (page = 1) => {
      const dbCities = await appDatabase
        .select()
        .from(cityTable)
        .where(eq(cityTable.isFavorite, false))
        .innerJoin(weatherTable, eq(cityTable.weather_id, weatherTable.id))
        .limit(page * 15);
      const remappedCities: City[] = dbCities.map((city) => cityRemapper(city));

      setCities(remappedCities);
    },
    [cityRemapper],
  );

  const getFavoriteCities = useCallback(
    async (page = 1) => {
      const dbCities = await appDatabase
        .select()
        .from(cityTable)
        .where(eq(cityTable.isFavorite, true))
        .innerJoin(weatherTable, eq(cityTable.weather_id, weatherTable.id))
        .limit(page * 15);
      const remappedCities: City[] = dbCities.map((city) => cityRemapper(city));

      setFavoriteCities(remappedCities);
    },
    [cityRemapper],
  );

  const getAllData = useCallback(
    async (page: number) => {
      await getAllCities(page);
      await getFavoriteCities(page);
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
      const city = await appDatabase
        .select()
        .from(cityTable)
        .where(eq(cityTable.id, cityId))
        .execute();

      if (city.length > 0) {
        await appDatabase.delete(cityTable).where(eq(cityTable.id, cityId));
        await appDatabase.delete(weatherTable).where(eq(weatherTable.id, city[0].weather_id));
      }

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
  }, []);

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
