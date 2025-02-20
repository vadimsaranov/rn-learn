import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

const TABS_SCREEN_OPTIONS = { tabBarActiveTintColor: 'blue', headerShown: false };

const HOME_TAB_OPTIONS = {
  title: 'Home',
  tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="home" color={color} />,
};

const SETTING_TAB_OPTIONS = {
  title: 'Settings',
  tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="cog" color={color} />,
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={TABS_SCREEN_OPTIONS}>
      <Tabs.Screen name="(home)" options={HOME_TAB_OPTIONS} />
      <Tabs.Screen name="(settings)" options={SETTING_TAB_OPTIONS} />
    </Tabs>
  );
}
