import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { Loader } from '@components/Loader';
import { persistor, store } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BiometricsContextProvider } from '@context/BiometricsContext';
import ThemeContextProvider from '@context/ThemeContext';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { SafeAreaView, Text, View } from 'react-native';
import { Suspense } from 'react';
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite/driver';

const DATABASE_NAME = 'rn-learn.db';
export const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const appDatabase = drizzle(expoDb);

export default function RootLayout() {
  const { success, error } = useMigrations(appDatabase, migrations);

  if (error) {
    return (
      <SafeAreaView>
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <ThemeContextProvider>
            <BiometricsContextProvider>
              <Slot />
            </BiometricsContextProvider>
          </ThemeContextProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
}
