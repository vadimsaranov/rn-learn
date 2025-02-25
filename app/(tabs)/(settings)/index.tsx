import { AppInformation } from '@components/AppInformation';
import { Button } from '@components/Button';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { resetAuthSlice } from '@store/slices/authSlice';
import { resetSessionSlice } from '@store/slices/sessionSlice';
import { userSelector } from '@store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import * as Linking from 'expo-linking';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CONTACT_BUTTON_TITLE = 'Contact Us';
const LOGOUT_BUTTON_TITLE = 'Logout';
const ICON_COLOR = '#b8b8b8';

const MAIL_SCHEMA = 'mailto:support@expo.dev';
const PHONE_SCHEMA = 'tel:+123456789';
const SMS_SCHEMA = 'sms:+123456789';

export default function SettingsTab() {
  const { email } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const signOut = useCallback(() => {
    dispatch(resetAuthSlice());
    dispatch(resetSessionSlice());
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
      <Text style={styles.email}>Email: {email}</Text>
      <View style={styles.buttonsContainer}>
        <Button onPress={() => openLink(MAIL_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
          <AntDesign size={20} name="mail" color={ICON_COLOR} />
        </Button>
        <Button onPress={() => openLink(PHONE_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
          <FontAwesome size={20} name="phone" color={ICON_COLOR} />
        </Button>
        <Button onPress={() => openLink(SMS_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
          <AntDesign size={20} name="message1" color={ICON_COLOR} />
        </Button>
      </View>
      <View style={styles.bottomContainer}>
        <Button title={LOGOUT_BUTTON_TITLE} onPress={signOut}>
          <AntDesign size={20} name={'logout'} color={ICON_COLOR} />
        </Button>
        <AppInformation />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
