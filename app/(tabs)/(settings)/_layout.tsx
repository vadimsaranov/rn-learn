import { Stack } from 'expo-router';
const SETTINGS_LAYOUT_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#f1f1f1' },
  contentStyle: { backgroundColor: '#fff' },
};
export default function SettingsLayout() {
  return (
    <Stack screenOptions={SETTINGS_LAYOUT_SCREEN_OPTIONS}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
