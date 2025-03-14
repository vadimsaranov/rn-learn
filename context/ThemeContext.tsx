import { appDatabase } from '@database/client';
import { toggleThemeMutation } from '@database/mutations/themeMutations';
import { themeTable } from '@database/schemas/themeTable';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

interface ThemeContextProps {
  children?: ReactNode;
}

export default function ThemeContextProvider({ children }: ThemeContextProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const { data: storedTheme } = useLiveQuery(appDatabase.select().from(themeTable));

  const phoneTheme = useColorScheme();

  useEffect(() => {
    if (storedTheme.length > 0 && storedTheme[0].currentTheme) {
      setTheme(storedTheme[0].currentTheme);
      Appearance.setColorScheme(storedTheme[0].currentTheme);
    } else if (phoneTheme) {
      setTheme(phoneTheme);
      Appearance.setColorScheme(phoneTheme);
    }
  }, [storedTheme, phoneTheme]);

  const data = useMemo(() => {
    return {
      theme,
      toggleTheme: () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        toggleThemeMutation(theme === 'light' ? 'dark' : 'light');
      },
    };
  }, [theme]);

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
}
