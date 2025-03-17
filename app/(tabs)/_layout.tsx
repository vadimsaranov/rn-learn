import { Button } from '@components/Button';
import { Colors } from '@constants/Colors';
import { BiometricsContext } from '@context/BiometricsContext';
import { ThemeContext } from '@context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useAppStateCheck from '@hooks/useAppStateCheck';
import { useLocales } from '@hooks/useLocales';
import { useUser } from '@hooks/useUser';
import { Redirect, Tabs } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppStateStatus, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const { user, userLoading } = useUser();
  const { theme } = useContext(ThemeContext);

  const { t } = useLocales();

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

  if (!userLoading && !user.id) {
    return <Redirect href={'/login'} />;
  }

  if (!biometricsEnrolled) {
    return (
      <View style={styles.biometrics}>
        <Button i18nKey="common.unlockScreen" onPress={promptBiometrics} />
      </View>
    );
  }
  return (
    <Tabs screenOptions={TABS_SCREEN_OPTIONS}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: t('common.home'),
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: t('common.settings'),
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
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
