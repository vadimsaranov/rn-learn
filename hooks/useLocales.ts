import { appDatabase } from '@database/client';
import { updateLanguageMutation } from '@database/mutations/languageMutations';
import { languageTable } from '@database/schemas/languageTable';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { getLocales } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import { useEffect } from 'react';
import { en } from '../i18n/translations/en';
import { es } from '../i18n/translations/es';

export enum Locales {
  EN = 'en',
  ES = 'es',
}
type NestedKeyOf<T> =
  T extends Record<string, any>
    ? { [K in keyof T]: `${K & string}` | `${K & string}.${NestedKeyOf<T[K]>}` }[keyof T]
    : never;

export type I18nKeyPath = NestedKeyOf<typeof en>;

const DEFAULT_LANGUAEGE = Locales.EN;
export const useLocales = () => {
  const { data } = useLiveQuery(appDatabase.select().from(languageTable));

  const i18n = new I18n({ en, es });
  i18n.enableFallback = true;
  i18n.locale = data[0]?.language || DEFAULT_LANGUAEGE;

  const t = (key: I18nKeyPath, options?: TranslateOptions) => {
    if (options) {
      return i18n.t(key, options);
    }
    return i18n.t(key);
  };

  const changeLocale = async (newLocale: Locales) => {
    await updateLanguageMutation(newLocale);
  };

  useEffect(() => {
    if (data[0]?.language.length === 0) {
      const phoneLang = getLocales()[0].languageCode;
      if (phoneLang) {
        updateLanguageMutation(phoneLang);
      }
    }
  }, [data]);

  return { i18n, t, changeLocale };
};
