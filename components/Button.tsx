import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  children?: ReactNode;
}
export const Button = ({ title, children, ...otherProps }: ButtonProps) => {
  return (
    <TouchableOpacity {...otherProps} style={styles.container}>
      <Text>{title}</Text>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#b8b8b8',
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
