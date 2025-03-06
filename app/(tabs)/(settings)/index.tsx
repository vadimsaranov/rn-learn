import { AppInformation } from '@components/AppInformation';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { resetAuthSlice } from '@store/slices/authSlice';
import { resetSessionSlice } from '@store/slices/sessionSlice';
import { resetThemeSlice } from '@store/slices/themeSlice';
import { userSelector } from '@store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import * as Linking from 'expo-linking';
import { useCallback, useContext } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { cityTable } from '@database/city';
import { weatherTable } from '@database/weather';
import { appDatabase } from '../../_layout';

const CONTACT_BUTTON_TITLE = 'Contact Us';
const LOGOUT_BUTTON_TITLE = 'Logout';

const MAIL_SCHEMA = 'mailto:support@expo.dev';
const PHONE_SCHEMA = 'tel:+123456789';
const SMS_SCHEMA = 'sms:+123456789';

export default function SettingsTab() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  const { email } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const signOut = useCallback(async () => {
    await appDatabase.delete(cityTable);
    await appDatabase.delete(weatherTable);
    dispatch(resetAuthSlice());
    dispatch(resetSessionSlice());
    dispatch(resetThemeSlice());
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
        <Text>{`Theme: ${theme}`}</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
      <Text style={styles.email}>Email: {email}</Text>
      <View style={styles.buttonsContainer}>
        <Button onPress={() => openLink(MAIL_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
          <AntDesign size={20} name="mail" color={Colors[theme].grey} />
        </Button>
        <Button onPress={() => openLink(PHONE_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
          <FontAwesome size={20} name="phone" color={Colors[theme].grey} />
        </Button>
        <Button onPress={() => openLink(SMS_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
          <AntDesign size={20} name="message1" color={Colors[theme].grey} />
        </Button>
      </View>
      <View style={styles.bottomContainer}>
        <Button title={LOGOUT_BUTTON_TITLE} onPress={signOut}>
          <AntDesign size={20} name={'logout'} color={Colors[theme].grey} />
        </Button>
        <AppInformation />
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
