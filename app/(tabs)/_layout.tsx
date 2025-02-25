import FontAwesome from '@expo/vector-icons/FontAwesome';
import useAppStateCheck from '@hooks/useAppStateCheck';
import { useBiometrics } from '@hooks/useBiometrics';
import { authSelector } from '@store/slices/authSlice';
import { updateBiometrics } from '@store/slices/biometricsSlice';
import { sessionSelector } from '@store/slices/sessionSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { Redirect, Tabs } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppStateStatus } from 'react-native';

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
  const { promptBiometrics } = useBiometrics();

  const dispatch = useAppDispatch();

  const { loggedIn } = useAppSelector(authSelector);
  const { loggedIn: session } = useAppSelector(sessionSelector);

  const [appStateStatus, setAppStateStatus] = useState<AppStateStatus | undefined>(undefined);
  useAppStateCheck({ setAppStateStatus });

  const onAppStateChange = useCallback(() => {
    if (appStateStatus === 'active') {
      dispatch(updateBiometrics({ enrolled: false }));
      promptBiometrics();
    }
  }, [appStateStatus]);

  useEffect(() => {
    onAppStateChange();
  }, [onAppStateChange]);

  if (!loggedIn && !session) {
    return <Redirect href={'/login'} />;
  }
  return (
    <Tabs screenOptions={TABS_SCREEN_OPTIONS}>
      <Tabs.Screen name="(home)" options={HOME_TAB_OPTIONS} />
      <Tabs.Screen name="(settings)" options={SETTING_TAB_OPTIONS} />
    </Tabs>
  );
}
