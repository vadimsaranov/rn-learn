import { Button } from '@components/Button';
import { Colors } from '@constants/Colors';
import { BiometricsContext } from '@context/BiometricsContext';
import { ThemeContext } from '@context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useAppStateCheck from '@hooks/useAppStateCheck';
import { authSelector } from '@store/slices/authSlice';
import { sessionSelector } from '@store/slices/sessionSlice';
import { useAppSelector } from '@store/store';
import { Redirect, Tabs } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppStateStatus, StyleSheet, View } from 'react-native';

const HOME_TAB_OPTIONS = {
  title: 'Home',
  tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="home" color={color} />,
};

const SETTING_TAB_OPTIONS = {
  title: 'Settings',
  tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="cog" color={color} />,
};

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);

  const TABS_SCREEN_OPTIONS = {
    headerShown: false,
    tabBarActiveTintColor: Colors[theme].tabBarActiveTint,
    headerTitleStyle: { color: Colors[theme].background },
  };

  const {
    promptBiometrics,
    setEnrolled: updateBiometrics,
    enrolled: biometricsEnrolled,
    loading: biometricsLoading,
  } = useContext(BiometricsContext);

  const { loggedIn } = useAppSelector(authSelector);
  const { loggedIn: session } = useAppSelector(sessionSelector);

  const [appStateStatus, setAppStateStatus] = useState<AppStateStatus | undefined>(undefined);
  useAppStateCheck({ setAppStateStatus });

  const onAppStateChange = useCallback(() => {
    if (appStateStatus === 'active') {
      updateBiometrics(false);
      promptBiometrics();
    }
  }, [appStateStatus, promptBiometrics, updateBiometrics]);

  useEffect(() => {
    onAppStateChange();
  }, [onAppStateChange]);

  useEffect(() => {
    if (!biometricsLoading && !biometricsEnrolled) {
      promptBiometrics();
    }
  }, [biometricsEnrolled, biometricsLoading, promptBiometrics]);

  if (!loggedIn && !session) {
    return <Redirect href={'/login'} />;
  }

  if (!biometricsEnrolled) {
    return (
      <View style={styles.biometrics}>
        <Button title="Unlock screen" onPress={promptBiometrics} />
      </View>
    );
  }
  return (
    <Tabs screenOptions={TABS_SCREEN_OPTIONS}>
      <Tabs.Screen name="(home)" options={HOME_TAB_OPTIONS} />
      <Tabs.Screen name="(settings)" options={SETTING_TAB_OPTIONS} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  biometrics: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
