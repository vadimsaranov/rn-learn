import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { Loader } from '@components/Loader';
import { persistor, store } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Slot />
      </PersistGate>
    </Provider>
  );
}
