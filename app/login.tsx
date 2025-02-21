import { useCallback, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSession from './context/AuthContext';
import { Button } from '@/components/Button';
import { router } from 'expo-router';

type InputValues = {
  email: string;
  password: string;
};

const hardCodedUser = {
  email: 'test@example.com',
  password: '123456',
};

export default function Login() {
  const { signIn } = useSession();
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
      signIn('token', rememberMe);
      router.replace('/');
    }
  }, [signIn, loginValues, rememberMe]);

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
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <View style={styles.rememberMeBlock}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text>Remember me</Text>
        </View>
      </View>
      <Button
        onPress={onButtonPress}
        title="Login"
        disabled={!(loginValues.email && loginValues.password)}
      />
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
});
