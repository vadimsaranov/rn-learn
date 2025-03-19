import { Colors } from '@constants/Colors';
import CitiesContextProvider from '@context/CitiesContext';
import { ThemeContext } from '@context/ThemeContext';
import { useLocales } from '@hooks/useLocales';
import { Stack } from 'expo-router';
import { useContext } from 'react';

export default function HomeLayout() {
  const { theme } = useContext(ThemeContext);
  const { t } = useLocales();
  const WEATHER_SCREEN_OPTIONS = { title: t('home.weather') };
  const DETAILS_SCREEN_OPTIONS = { title: t('home.details') };
  const ADD_OR_EDIT_WEATHER_SCREEN_OPTIONS = { title: t('home.addWeather'), headerShown: false };
  const WEATHER_ICONS_SCREEN_OPTIONS = { title: t('home.chooseIcon') };
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
        <Stack.Screen name="addOrEditCityWeather" options={ADD_OR_EDIT_WEATHER_SCREEN_OPTIONS} />
        <Stack.Screen name="chooseWeatherIcon" options={WEATHER_ICONS_SCREEN_OPTIONS} />
      </Stack>
    </CitiesContextProvider>
  );
}
