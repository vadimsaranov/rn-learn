import * as Application from 'expo-application';
import { Text } from 'react-native';

export const AppInformation = () => {
  const { nativeBuildVersion, nativeApplicationVersion } = Application;
  return <Text>{`Version ${nativeBuildVersion} (${nativeApplicationVersion})`}</Text>;
};
