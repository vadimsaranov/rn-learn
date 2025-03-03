import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { useContext } from 'react';
import { Text as RNText, TextProps as RNTextprops, StyleSheet } from 'react-native';

export const Text = ({ ...props }: RNTextprops) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);
  return <RNText {...props} style={[styles.color, props.style]}></RNText>;
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    color: {
      color: Colors[theme].text,
    },
  });
