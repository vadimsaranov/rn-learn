import { City } from '@/core/City';
import { Stack } from 'expo-router';
import { createContext } from 'react';
import useFetchCities from './hooks/useFetchCity';

const HOME_LAYOUT_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#f1f1f1' },
  contentStyle: { backgroundColor: '#fff' },
};
const WEATHER_SCREEN_OPTIONS = { title: 'Weather' };
const DETAILS_SCREEN_OPTIONS = { title: 'Details' };

type CitiesContextType = {
  cities: City[];
  getCityByName: (cityName: string) => City | undefined;
  loading: boolean;
};

export const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  getCityByName: () => undefined,
  loading: false,
});

export default function HomeLayout() {
  const { getCityByName, loading, data: cities } = useFetchCities();

  return (
    <CitiesContext.Provider value={{ cities, getCityByName, loading }}>
      <Stack screenOptions={HOME_LAYOUT_SCREEN_OPTIONS}>
        <Stack.Screen name="index" options={WEATHER_SCREEN_OPTIONS} />
        <Stack.Screen name="details" options={DETAILS_SCREEN_OPTIONS} />
      </Stack>
    </CitiesContext.Provider>
  );
}
