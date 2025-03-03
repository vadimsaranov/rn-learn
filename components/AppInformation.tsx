import { Text } from '@components/Text';
import * as Application from 'expo-application';

export const AppInformation = () => {
  const { nativeBuildVersion, nativeApplicationVersion } = Application;
  return <Text>{`Version ${nativeBuildVersion} (${nativeApplicationVersion})`}</Text>;
};
