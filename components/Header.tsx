import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { I18nKeyPath } from '@hooks/useLocales';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

interface HeaderProps {
  title: I18nKeyPath;
  onPress: () => void;
}
export const Header = ({ onPress, title }: HeaderProps) => {
  const { theme } = useContext(ThemeContext);

  const styles = themedStyles(theme);
  return (
    <View style={styles.container}>
      <AntDesign onPress={onPress} size={20} name="arrowleft" color={Colors[theme].text} />
      <Text style={styles.text} i18nKey={title} />
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
      flex: 1,
      fontSize: 20,
    },
  });
