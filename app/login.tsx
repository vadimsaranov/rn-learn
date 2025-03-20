import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { TextInput } from '@components/TextInput';
import { Colors } from '@constants/Colors';
import { BiometricsContext } from '@context/BiometricsContext';
import { Theme, ThemeContext } from '@context/ThemeContext';
import { saveUserMutation } from '@database/mutations/userMutations';
import { MaterialIcons } from '@expo/vector-icons';
import { updateUser } from '@store/slices/userSlice';
import { useAppDispatch } from '@store/store';
import { router } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

type InputValues = {
  email: string;
  password: string;
};

const hardCodedUser = {
  email: 'test@example.com',
  password: '123456',
};

export default function Login() {
  const dispatch = useAppDispatch();

  const { theme } = useContext(ThemeContext);

  const styles = themedStyles(theme);

  const { enrolled, loginWithBiometrics } = useContext(BiometricsContext);

  const [rememberMe, setRememberMe] = useState(false);

  const [loginValues, setLoginValues] = useState<InputValues>({ email: '', password: '' });

  const [error, setError] = useState('');

  const onButtonPress = useCallback(() => {
    if (
      loginValues.email.toLowerCase() !== hardCodedUser.email ||
      loginValues.password !== hardCodedUser.password
    ) {
      setError('Invalid credentials');
      setTimeout(() => {
        setError('');
      }, 2000);
    } else {
      if (rememberMe) {
        saveUserMutation({ email: loginValues.email, id: uuid.v4(), rememberUser: true });
      } else {
        dispatch(updateUser({ email: loginValues.email, id: uuid.v4(), rememberUser: false }));
      }
      router.replace('/');
    }
  }, [loginValues, rememberMe, dispatch]);

  const onInputValuesChange = useCallback((value: string, key: keyof InputValues) => {
    setLoginValues((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperContainer}>
        <TextInput
          onChangeText={(value) => onInputValuesChange(value, 'email')}
          value={loginValues.email}
        />
        <TextInput
          onChangeText={(value) => onInputValuesChange(value, 'password')}
          value={loginValues.password}
          secureTextEntry
        />
        {!!error && <Text style={styles.warningText}>{error}</Text>}
        <View style={styles.rememberMeBlock}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text i18nKey="login.rememeberMe" />
        </View>
      </View>
      <View style={styles.bottomButtons}>
        <Button
          onPress={onButtonPress}
          i18nKey="login.login"
          disabled={!(loginValues.email || loginValues.password)}
        />
        {!!enrolled && (
          <Button
            onPress={() => loginWithBiometrics(rememberMe)}
            i18nKey="login.loginWithBiometrics">
            <MaterialIcons name="touch-app" size={24} color="black" />
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: Colors[theme].background,
    },
    upperContainer: {
      gap: 8,
    },

    rememberMeBlock: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    warningText: {
      color: Colors[theme].red,
    },
    bottomButtons: {
      gap: 16,
      marginBottom: 16,
    },
  });
