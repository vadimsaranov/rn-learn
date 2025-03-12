import { drizzle } from 'drizzle-orm/expo-sqlite/driver';
import { openDatabaseSync } from 'expo-sqlite';

const DATABASE_NAME = 'rn-learn.db';

export const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const appDatabase = drizzle(expoDb);
