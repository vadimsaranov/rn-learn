import { appDatabase } from '@database/client';
import { getLanguageQuery } from '@database/queries/languageQueries';
import { languageTable } from '@database/schemas/languageTable';

export const updateLanguageMutation = async (newLanguage: string) => {
  const language = await getLanguageQuery();
  if (language) {
    await appDatabase.update(languageTable).set({ language: newLanguage });
    return;
  }
  await appDatabase.insert(languageTable).values({ language: newLanguage });
};
