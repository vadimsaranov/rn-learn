import { Stack } from 'expo-router';

const HOME_LAYOUT_SCREEN_OPTIONS = { headerStyle: { backgroundColor: '#f1f1f1' } };
const WEATHER_SCREEN_OPTIONS = { title: 'Weather' };
const DETAILS_SCREEN_OPTIONS = { title: 'Details' };

export default function HomeLayout() {
  return (
    <Stack screenOptions={HOME_LAYOUT_SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={WEATHER_SCREEN_OPTIONS} />
      <Stack.Screen name="details" options={DETAILS_SCREEN_OPTIONS} />
    </Stack>
  );
}
