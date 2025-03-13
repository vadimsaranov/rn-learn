import { City } from '@core/City';
import { appDatabase } from '@database/client';
import { getCityByIdQuery } from '@database/queries/cityQueries';
import { cityTable } from '@database/schemas/cityTable';
import { weatherTable } from '@database/schemas/weatherTable';
import { eq } from 'drizzle-orm';

export const deleteCityMutation = async (cityId: string) => {
  const city = await getCityByIdQuery(cityId);

  if (city.length > 0) {
    await appDatabase.delete(cityTable).where(eq(cityTable.id, cityId));
    await appDatabase.delete(weatherTable).where(eq(weatherTable.id, city[0].weather_table.id));
  }
};

export const updateCityMutation = async (city: City, weatherId: number) => {
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
      weather_id: weatherId,
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
};

export const saveCityMutation = async (city: City) => {
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
};
