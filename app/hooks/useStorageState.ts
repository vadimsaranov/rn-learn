import { useEffect, useCallback, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value === null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export default function useStorageState(key: string) {
  const [state, setState] = useState<string | null>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(key).then((value) => {
      setState(value);
      setLoading(false);
    });
  }, [key]);

  const setValue = useCallback(
    (value: string | null, saveUser?: boolean) => {
      setState(value);
      if (saveUser) {
        setStorageItemAsync(key, value);
      }
    },
    [key],
  );
  const removeValue = useCallback(() => {
    setState(null);

    setStorageItemAsync(key, null);
  }, [key]);

  return { state, setValue, removeValue, loading };
}
