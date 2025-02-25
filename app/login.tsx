import { Button } from '@components/Button';
import { BiometricsContext } from '@context/BiometricsContext';
import { MaterialIcons } from '@expo/vector-icons';
import { updateAuth } from '@store/slices/authSlice';
import { updateSession } from '@store/slices/sessionSlice';
import { useAppDispatch } from '@store/store';
import { router } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        dispatch(updateAuth({ loggedIn: true, token: 'token' }));
      } else {
        dispatch(updateSession({ loggedIn: true, token: 'token' }));
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
          style={styles.textInput}
        />
        <TextInput
          onChangeText={(value) => onInputValuesChange(value, 'password')}
          value={loginValues.password}
          style={styles.textInput}
          secureTextEntry
        />
        {!!error && <Text style={styles.warningText}>{error}</Text>}
        <View style={styles.rememberMeBlock}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text>Remember me</Text>
        </View>
      </View>
      <View style={styles.bottomButtons}>
        <Button
          onPress={onButtonPress}
          title="Login"
          disabled={!(loginValues.email || loginValues.password)}
        />
        {!!enrolled && (
          <Button
            onPress={() => loginWithBiometrics(rememberMe)}
            title="Login with biometrics"
            disabled={!(loginValues.email || loginValues.password)}>
            <MaterialIcons name="touch-app" size={24} color="black" />
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  upperContainer: {
    gap: 8,
  },
  textInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  rememberMeBlock: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  warningText: {
    color: 'red',
  },
  bottomButtons: {
    gap: 16,
    marginBottom: 16,
  },
});
