import useStorageState from '@hooks/useStorageState';
import { useContext, createContext, type PropsWithChildren, useMemo } from 'react';

type AuthContextType = {
  signIn: (token: string, saveUser: boolean) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: true,
});

export default function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const {
    state: session,
    setValue: setSession,
    loading: isLoading,
    removeValue,
  } = useStorageState('session');

  const value = useMemo<AuthContextType>(
    () => ({
      signIn: (token, saveUser) => {
        setSession(token, saveUser);
      },
      signOut: () => {
        removeValue();
      },
      session,
      isLoading,
    }),
    [isLoading, removeValue, session, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
