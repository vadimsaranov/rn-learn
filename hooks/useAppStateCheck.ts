import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { NativeEventSubscription, AppState, AppStateStatus } from 'react-native';

interface useAppStateCheckProps {
  setAppStateStatus: Dispatch<SetStateAction<AppStateStatus | undefined>>;
}

export default function useAppStateCheck(props: useAppStateCheckProps) {
  const { setAppStateStatus } = props;

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      setAppStateStatus(nextAppState);
    },
    [setAppStateStatus],
  );

  useEffect(() => {
    let eventListener: NativeEventSubscription;
    eventListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      eventListener.remove();
    };
  }, [handleAppStateChange]);
}
