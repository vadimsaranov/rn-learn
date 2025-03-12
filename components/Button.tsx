import { Text } from '@components/Text';
import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { ReactNode, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable, PressableProps } from 'react-native-gesture-handler';
interface ButtonProps extends PressableProps {
  title: string;
  children?: ReactNode;
}
export const Button = ({ title, children, disabled, ...otherProps }: ButtonProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);

  return (
    <Pressable
      {...otherProps}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}>
      <Text>{title}</Text>
      {children}
    </Pressable>
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
