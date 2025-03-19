import { Text } from '@components/Text';
import * as Application from 'expo-application';

export const AppInformation = () => {
  const { nativeBuildVersion: buildVersion, nativeApplicationVersion: applicationVersion } =
    Application;
  return <Text i18nKey="settings.version" i18nOptions={{ buildVersion, applicationVersion }} />;
};
