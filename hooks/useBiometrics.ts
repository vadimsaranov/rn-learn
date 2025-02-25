import { updateAuth } from '@store/slices/authSlice';
import { updateBiometrics } from '@store/slices/biometricsSlice';
import { updateSession } from '@store/slices/sessionSlice';
import { useAppDispatch } from '@store/store';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useEffect } from 'react';

export const useBiometrics = () => {
  const dispatch = useAppDispatch();

  const promptBiometrics = async () => {
    try {
      const isSupported = await checkBiometricsCompatibility();

      if (isSupported) {
        const authentication = await LocalAuthentication.authenticateAsync({
          biometricsSecurityLevel: 'strong',
          promptMessage: 'Set up biometrics',
        });
        if (authentication.success) {
          dispatch(updateBiometrics({ enrolled: true }));
        }
        if (!authentication.success && authentication.error) {
          dispatch(updateBiometrics({ enrolled: false }));
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const checkBiometricsCompatibility = async () => {
    return await LocalAuthentication.hasHardwareAsync();
  };

  const checkSavedBiometrics = async () => {
    const result = await LocalAuthentication.isEnrolledAsync();

    dispatch(updateBiometrics({ enrolled: result }));
  };

  const loginWithBiometrics = async (rememberUser: boolean) => {
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
  };

  useEffect(() => {
    checkSavedBiometrics();
  }, []);

  return { promptBiometrics, loginWithBiometrics };
};
