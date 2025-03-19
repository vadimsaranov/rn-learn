import { Colors } from '@constants/Colors';
import { ThemeContext } from '@context/ThemeContext';
import { useLocales } from '@hooks/useLocales';
import { Stack } from 'expo-router';
import { useContext } from 'react';

export default function SettingsLayout() {
  const { t } = useLocales();
  const { theme } = useContext(ThemeContext);

  const SETTINGS_LAYOUT_SCREEN_OPTIONS = {
    headerTintColor: Colors[theme].text,
    headerStyle: { backgroundColor: Colors[theme].background },
    contentStyle: { backgroundColor: Colors[theme].background },
  };
  return (
    <Stack screenOptions={SETTINGS_LAYOUT_SCREEN_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          title: t('common.settings'),
        }}
      />
    </Stack>
  );
}
