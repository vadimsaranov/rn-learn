import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppDispatch } from '@store/store';
import { router } from 'expo-router';
import * as Device from 'expo-device';
import uuid from 'react-native-uuid';
import { updateUser } from '@store/slices/userSlice';
import { saveUserMutation } from '@database/mutations/userMutations';

type BiometricsContextType = {
  enrolled: boolean;
  setEnrolled: Dispatch<SetStateAction<boolean>>;
  loginWithBiometrics: (rememberUser: boolean) => void;
  promptBiometrics: () => void;
  loading: boolean;
};

interface BiometricsContextProps {
  children: ReactNode | undefined;
}

export const BiometricsContext = createContext<BiometricsContextType>({
  enrolled: false,
  setEnrolled: () => undefined,
  loginWithBiometrics: () => undefined,
  promptBiometrics: () => undefined,
  loading: true,
});

export const BiometricsContextProvider = ({ children }: BiometricsContextProps) => {
  const [enrolled, setEnrolled] = useState<BiometricsContextType['enrolled']>(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const checkBiometricsCompatibility = useCallback(async () => {
    return await LocalAuthentication.hasHardwareAsync();
  }, []);

  const promptBiometrics = useCallback(async () => {
    if (!Device.isDevice) {
      setEnrolled(true);
      return;
    }
    try {
      const isSupported = await checkBiometricsCompatibility();

      if (isSupported) {
        const authentication = await LocalAuthentication.authenticateAsync({
          biometricsSecurityLevel: 'strong',
          promptMessage: 'Set up biometrics',
        });
        if (authentication.success) {
          setEnrolled(true);
        }
        if (!authentication.success && authentication.error) {
          setEnrolled(false);
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  }, [checkBiometricsCompatibility]);

  const checkSavedBiometrics = useCallback(async () => {
    setLoading(true);
    const result = await LocalAuthentication.isEnrolledAsync();
    setEnrolled(result);
    setLoading(false);
  }, []);

  const loginWithBiometrics = useCallback(
    async (rememberMe: boolean) => {
      const authentication = await LocalAuthentication.authenticateAsync({
        biometricsSecurityLevel: 'strong',
        promptMessage: 'Set up biometrics',
      });
      if (authentication.success) {
        if (rememberMe) {
          saveUserMutation({ email: 'test@example.com', id: uuid.v4(), rememberUser: true });
        } else {
          dispatch(updateUser({ email: 'test@example.com', id: uuid.v4(), rememberUser: false }));
        }
        router.replace('/');
      }
    },
    [dispatch],
  );

  useEffect(() => {
    checkSavedBiometrics();
  }, [checkSavedBiometrics]);

  const value = useMemo<BiometricsContextType>(
    () => ({
      enrolled,
      setEnrolled,
      loginWithBiometrics,
      promptBiometrics,
      loading,
    }),
    [enrolled, loading, loginWithBiometrics, promptBiometrics],
  );

  return <BiometricsContext.Provider value={value}>{children}</BiometricsContext.Provider>;
};
