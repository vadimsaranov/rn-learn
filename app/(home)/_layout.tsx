import { City } from '@/core/City';
import { Stack } from 'expo-router';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

const HOME_LAYOUT_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#f1f1f1' },
  contentStyle: { backgroundColor: '#fff' },
};
const WEATHER_SCREEN_OPTIONS = { title: 'Weather' };
const DETAILS_SCREEN_OPTIONS = { title: 'Details' };

type CitiesContextType = {
  cities: City[];
  setCities: Dispatch<SetStateAction<City[]>>;
};

export const CitiesContext = createContext<CitiesContextType>({ cities: [], setCities: () => {} });

export default function HomeLayout() {
  const [cities, setCities] = useState<City[]>([]);
  return (
    <CitiesContext.Provider value={{ cities, setCities }}>
      <Stack screenOptions={HOME_LAYOUT_SCREEN_OPTIONS}>
        <Stack.Screen name="index" options={WEATHER_SCREEN_OPTIONS} />
        <Stack.Screen name="details" options={DETAILS_SCREEN_OPTIONS} />
      </Stack>
    </CitiesContext.Provider>
  );
}
