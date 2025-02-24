import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from '@store/slices/userSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer } from '@store/slices/authSlice';
import { sessionReducer } from '@store/slices/sessionSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['session'],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  session: sessionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
