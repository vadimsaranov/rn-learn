import { appDatabase } from '@database/client';
import { cityTable } from '@database/schemas/cityTable';
import { weatherTable } from '@database/schemas/weatherTable';
import { eq } from 'drizzle-orm';

export const getCityByIdQuery = async (cityId: string) => {
  const city = await appDatabase
    .select()
    .from(cityTable)
    .where(eq(cityTable.id, cityId))
    .innerJoin(weatherTable, eq(cityTable.weather_id, weatherTable.id));

  return city;
};

export const getCitiesByFilterQuery = async (page: number, isFavorite = false) => {
  const cities = await appDatabase
    .select()
    .from(cityTable)
    .where(eq(cityTable.isFavorite, isFavorite))
    .innerJoin(weatherTable, eq(cityTable.weather_id, weatherTable.id))
    .limit(page * 15);
  return cities;
};
export const getAllCitiesQuery = async (page: number) => {
  const cities = await appDatabase
    .select()
    .from(cityTable)
    .innerJoin(weatherTable, eq(cityTable.weather_id, weatherTable.id))
    .limit(page * 15);
  return cities;
};
