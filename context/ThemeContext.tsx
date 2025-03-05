import { themeSelector, updateTheme } from '@store/slices/themeSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
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
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useState<Theme>('light');
  const { currentTheme: storedTheme } = useAppSelector(themeSelector);

  const phoneTheme = useColorScheme();

  useEffect(() => {
    if (storedTheme) {
      setTheme(storedTheme);
      Appearance.setColorScheme(storedTheme);
    } else if (phoneTheme) {
      setTheme(phoneTheme);
      Appearance.setColorScheme(storedTheme);
    }
  }, []);

  const data = useMemo(() => {
    return {
      theme,
      toggleTheme: () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        dispatch(updateTheme({ currentTheme: theme === 'light' ? 'dark' : 'light' }));
      },
    };
  }, [theme, dispatch]);

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
}
