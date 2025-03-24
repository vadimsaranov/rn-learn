import { AppInformation } from '@components/AppInformation';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { wipeDatabase } from '@database/utils';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Locales, useLocales } from '@hooks/useLocales';
import { resetUser, userSelector } from '@store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useCallback, useContext } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

const MAIL_SCHEMA = 'mailto:support@expo.dev';
const PHONE_SCHEMA = 'tel:+123456789';
const SMS_SCHEMA = 'sms:+123456789';

export default function SettingsTab() {
  const { i18n, changeLocale } = useLocales();

  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  const { email } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const signOut = useCallback(async () => {
    await wipeDatabase();
    dispatch(resetUser());
  }, [dispatch]);

  const openLink = useCallback(async (url: string) => {
    try {
      const canOpenUrl = await Linking.canOpenURL(url);
      if (canOpenUrl) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log(error, `Error while opening link ${url}`);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text i18nKey="settings.theme" i18nOptions={{ theme }} />
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
      <Text style={styles.email} i18nKey="settings.email" i18nOptions={{ email }} />
      <View style={styles.buttonsContainer}>
        <Button onPress={() => openLink(MAIL_SCHEMA)} i18nKey="settings.contactUs">
          <AntDesign size={20} name="mail" color={Colors[theme].grey} />
        </Button>
        <Button onPress={() => openLink(PHONE_SCHEMA)} i18nKey="settings.contactUs">
          <FontAwesome size={20} name="phone" color={Colors[theme].grey} />
        </Button>
        <Button onPress={() => openLink(SMS_SCHEMA)} i18nKey="settings.contactUs">
          <AntDesign size={20} name="message1" color={Colors[theme].grey} />
        </Button>
      </View>
      <View style={styles.bottomContainer}>
        <Button i18nKey="settings.logout" onPress={signOut}>
          <AntDesign size={20} name={'logout'} color={Colors[theme].grey} />
        </Button>
        <AppInformation />
      </View>
      <View>
        <Button
          disabled={i18n.locale === Locales.EN}
          onPress={() => changeLocale(Locales.EN)}
          title="English"
        />
        <Button
          disabled={i18n.locale === Locales.ES}
          onPress={() => changeLocale(Locales.ES)}
          title="Spanish"
        />
      </View>
      <View>
        <Button onPress={() => router.navigate('/turboModuleTest')} title="Turbo modules" />
      </View>
    </View>
  );
}

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 16,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    email: { fontSize: 17 },

    buttonsContainer: {
      gap: 8,
    },
    bottomContainer: {
      gap: 8,
    },
    row: {
      flexDirection: 'row',
      gap: 8,
    },
  });
