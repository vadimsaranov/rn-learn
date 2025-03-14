import { Loader } from '@components/Loader';
import { BiometricsContextProvider } from '@context/BiometricsContext';
import ThemeContextProvider from '@context/ThemeContext';
import { store } from '@store/store';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';

import { appDatabase } from '@database/client';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Suspense } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import migrations from '../drizzle/migrations';

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
      <SafeAreaView>
        <Text>Migration is in progress...</Text>
      </SafeAreaView>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <GestureHandlerRootView>
          <ThemeContextProvider>
            <BiometricsContextProvider>
              <Slot />
            </BiometricsContextProvider>
          </ThemeContextProvider>
        </GestureHandlerRootView>
      </Provider>
    </Suspense>
  );
}
