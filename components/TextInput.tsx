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
  return (
    <View>
      <TextInputRN
        {...props}
        style={[styles.container, props.style, error && styles.error]}></TextInputRN>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
  },
  error: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 4,
    color: 'red',
  },
});
