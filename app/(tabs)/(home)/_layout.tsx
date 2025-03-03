import { Colors } from '@constants/Colors';
import CitiesContextProvider from '@context/CitiesContext';
import { ThemeContext } from '@context/ThemeContext';
import { Stack } from 'expo-router';
import { useContext } from 'react';

const WEATHER_SCREEN_OPTIONS = { title: 'Weather' };
const DETAILS_SCREEN_OPTIONS = { title: 'Details' };
const ADD_WEATHER_SCREEN_OPTIONS = { title: 'Add weather' };
const WEATHER_ICONS_SCREEN_OPTIONS = { title: 'Choose icon' };

export default function HomeLayout() {
  const { theme } = useContext(ThemeContext);
  const HOME_LAYOUT_SCREEN_OPTIONS = {
    headerTintColor: Colors[theme].text,
    headerStyle: { backgroundColor: Colors[theme].background },
    contentStyle: { backgroundColor: Colors[theme].background },
  };
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
