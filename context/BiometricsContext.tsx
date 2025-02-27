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
import { updateAuth } from '@store/slices/authSlice';
import { updateSession } from '@store/slices/sessionSlice';
import { router } from 'expo-router';
import * as Device from 'expo-device';

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
  }, []);

  const checkBiometricsCompatibility = useCallback(async () => {
    return await LocalAuthentication.hasHardwareAsync();
  }, []);
  const checkSavedBiometrics = useCallback(async () => {
    setLoading(true);
    const result = await LocalAuthentication.isEnrolledAsync();
    setEnrolled(result);
    setLoading(false);
  }, []);

  const loginWithBiometrics = useCallback(
    async (rememberUser: boolean) => {
      const authentication = await LocalAuthentication.authenticateAsync({
        biometricsSecurityLevel: 'strong',
        promptMessage: 'Set up biometrics',
      });
      if (authentication.success) {
        if (rememberUser) {
          dispatch(updateAuth({ loggedIn: true, token: 'token' }));
        } else {
          dispatch(updateSession({ loggedIn: true, token: 'token' }));
        }
        router.replace('/');
      }
    },
    [dispatch],
  );

  useEffect(() => {
    checkSavedBiometrics();
  }, []);

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
