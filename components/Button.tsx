import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { ReactNode, useContext } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  children?: ReactNode;
}
export const Button = ({ title, children, disabled, ...otherProps }: ButtonProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  return (
    <TouchableOpacity
      {...otherProps}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}>
      <Text>{title}</Text>
      {children}
    </TouchableOpacity>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: Colors[theme].buttonBorder,
      padding: 8,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      backgroundColor: Colors[theme].background,
    },
    disabled: {
      opacity: 0.4,
    },
  });
