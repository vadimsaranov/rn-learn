import { Colors } from '@constants/Colors';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { useContext } from 'react';
import {
  TextInput as TextInputRN,
  TextInputProps as TextInputPropsRN,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface TextInputProps extends TextInputPropsRN {
  error?: boolean;
  errorText?: string;
}

export const TextInput = ({ error, errorText, ...props }: TextInputProps) => {
  const { theme } = useContext(ThemeContext);
  const styles = themedStyles(theme);
  return (
    <View>
      <TextInputRN
        {...props}
        placeholderTextColor={Colors[theme].placeholder}
        style={[styles.container, props.style, error && styles.error]}></TextInputRN>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: Colors[theme].buttonBorder,
      color: Colors[theme].text,
    },
    error: {
      borderColor: Colors[theme].red,
    },
    errorText: {
      marginTop: 4,
      color: Colors[theme].red,
    },
  });
