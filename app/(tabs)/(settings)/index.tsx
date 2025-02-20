import { AppInformation } from '@/components/AppInformation';
import { Button } from '@/components/Button';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';

const CONTACT_BUTTON_TITLE = 'Contact Us';
const LOGOUT_BUTTON_TITLE = 'Logout';
const ICON_COLOR = '#b8b8b8';

const MAIL_SCHEMA = 'mailto:support@expo.dev';
const PHONE_SCHEMA = 'tel:+123456789';
const SMS_SCHEMA = 'sms:+123456789';

export default function SettingsTab() {
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
      <View style={styles.buttonsContainer}>
        <Button onPress={async () => openLink(MAIL_SCHEMA)} title={CONTACT_BUTTON_TITLE}>
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
        <Button title={LOGOUT_BUTTON_TITLE}>
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
  buttonsContainer: {
    gap: 8,
  },
  bottomContainer: {
    gap: 8,
  },
});
