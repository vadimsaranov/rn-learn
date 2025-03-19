import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { I18nKeyPath, useLocales } from '@hooks/useLocales';
import { TranslateOptions } from 'i18n-js';
import { useContext } from 'react';
import { Text as RNText, TextProps as RNTextprops, StyleSheet } from 'react-native';

interface TextProps extends RNTextprops {
  i18nKey?: I18nKeyPath;
  i18nOptions?: TranslateOptions;
}

export const Text = ({ children, i18nKey, i18nOptions, ...props }: TextProps) => {
  const { t } = useLocales();
  const text = i18nKey ? t(i18nKey, i18nOptions) : children;
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);
  return (
    <RNText {...props} style={[styles.color, props.style]}>
      {text}
    </RNText>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    color: {
      color: Colors[theme].text,
    },
  });
