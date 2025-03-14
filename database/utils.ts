import { appDatabase } from '@database/client';
import { cityTable } from '@database/schemas/cityTable';
import { userTable } from '@database/schemas/userTable';
import { weatherTable } from '@database/schemas/weatherTable';

export const wipeDatabase = async () => {
  await appDatabase.delete(cityTable);
  await appDatabase.delete(weatherTable);
  await appDatabase.delete(userTable);
};
