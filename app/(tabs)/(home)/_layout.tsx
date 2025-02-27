import CitiesContextProvider from '@context/CitiesContext';
import { Stack } from 'expo-router';

const HOME_LAYOUT_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#f1f1f1' },
  contentStyle: { backgroundColor: '#fff' },
};
const WEATHER_SCREEN_OPTIONS = { title: 'Weather' };
const DETAILS_SCREEN_OPTIONS = { title: 'Details' };
const ADD_WEATHER_SCREEN_OPTIONS = { title: 'Add weather' };
const WEATHER_ICONS_SCREEN_OPTIONS = { title: 'Choose icon' };

export default function HomeLayout() {
  return (
    <CitiesContextProvider>
      <Stack screenOptions={HOME_LAYOUT_SCREEN_OPTIONS}>
        <Stack.Screen name="index" options={WEATHER_SCREEN_OPTIONS} />
        <Stack.Screen name="details" options={DETAILS_SCREEN_OPTIONS} />
        <Stack.Screen name="newWeatherCity" options={ADD_WEATHER_SCREEN_OPTIONS} />
        <Stack.Screen name="chooseWeatherIcon" options={WEATHER_ICONS_SCREEN_OPTIONS} />
      </Stack>
    </CitiesContextProvider>
  );
}
