import { Stack } from 'expo-router';
const SETTINGS_LAYOUT_SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#f1f1f1' },
  contentStyle: { backgroundColor: '#fff' },
};

const SETTING_TAB_OPTIONS = {
  title: 'Settings',
};
export default function SettingsLayout() {
  return (
    <Stack screenOptions={SETTINGS_LAYOUT_SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={SETTING_TAB_OPTIONS} />
    </Stack>
  );
}
