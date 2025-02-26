import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { Loader } from '@components/Loader';
import { persistor, store } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BiometricsContextProvider } from '@context/BiometricsContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <BiometricsContextProvider>
          <Slot />
        </BiometricsContextProvider>
      </PersistGate>
    </Provider>
  );
}
