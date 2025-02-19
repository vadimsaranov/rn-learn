import { Stack } from 'expo-router';
import CitiesContextProvider from './context/CitiesContext';

const HOME_LAYOUT_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#f1f1f1' },
  contentStyle: { backgroundColor: '#fff' },
};
const WEATHER_SCREEN_OPTIONS = { title: 'Weather' };
const DETAILS_SCREEN_OPTIONS = { title: 'Details' };

export default function HomeLayout() {
  return (
    <CitiesContextProvider>
      <Stack screenOptions={HOME_LAYOUT_SCREEN_OPTIONS}>
        <Stack.Screen name="index" options={WEATHER_SCREEN_OPTIONS} />
        <Stack.Screen name="details" options={DETAILS_SCREEN_OPTIONS} />
      </Stack>
    </CitiesContextProvider>
  );
}
