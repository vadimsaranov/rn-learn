import { appDatabase } from '@database/client';
import { languageTable } from '@database/schemas/languageTable';

export const getLanguageQuery = async () => {
  const language = await appDatabase.select().from(languageTable);
  if (language[0]?.language) {
    return language[0].language;
  }
};
