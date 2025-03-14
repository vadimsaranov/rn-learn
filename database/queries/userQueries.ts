import { appDatabase } from '@database/client';
import { userTable } from '@database/schemas/userTable';

export const getUserQuery = async () => {
  const users = await appDatabase.select().from(userTable);
  if (users[0]) {
    return users[0];
  }
};
