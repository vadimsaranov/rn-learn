import { Theme } from '@context/ThemeContext';
import { appDatabase } from '@database/client';
import { getThemeQuery } from '@database/queries/themeQueries';
import { themeTable } from '@database/schemas/themeTable';

export const toggleThemeMutation = async (theme: Theme) => {
  const currentTheme = await getThemeQuery();

  if (currentTheme) {
    await appDatabase.update(themeTable).set({ currentTheme: theme });
  }
  await appDatabase.insert(themeTable).values({ currentTheme: theme });
};
