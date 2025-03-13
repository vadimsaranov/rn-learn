import { appDatabase } from '@database/client';
import { themeTable } from '@database/schemas/themeTable';

export const getThemeQuery = async () => {
  const theme = await appDatabase.select().from(themeTable);
  if (theme[0]?.currentTheme) {
    return theme[0].currentTheme;
  }
};
