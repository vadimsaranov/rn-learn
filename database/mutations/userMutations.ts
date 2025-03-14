import { User } from '@core/User';
import { appDatabase } from '@database/client';
import { userTable } from '@database/schemas/userTable';

export const saveUserMutation = async (user: User) => {
  await appDatabase.insert(userTable).values(user);
};
