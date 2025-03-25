import { appDatabase } from '@database/client';
import { updateLanguageMutation } from '@database/mutations/languageMutations';
import { languageTable } from '@database/schemas/languageTable';
import { getLocales } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import { useEffect, useState } from 'react';
import { en } from '../i18n/translations/en';
import { es } from '../i18n/translations/es';

export enum Locales {
  EN = 'en',
  ES = 'es',
}
type NestedKeyOf<T, Prefix extends string = ''> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: T[K] extends Record<string, any>
          ? NestedKeyOf<T[K], `${Prefix}${K & string}.`>
          : `${Prefix}${K & string}`;
      }[keyof T]
    : never;

export type I18nKeyPath = NestedKeyOf<typeof en>;

const DEFAULT_LANGUAEGE = Locales.EN;
export const useLocales = () => {
  const [currentLocale, setCurrentLocale] = useState(DEFAULT_LANGUAEGE);

  const i18n = new I18n({ en, es });
  i18n.locale = currentLocale;

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
    appDatabase
      .select()
      .from(languageTable)
      .then((data) => {
        if (data[0]?.language.length > 0) {
          setCurrentLocale(data[0].language as Locales);
          return;
        }
        const phoneLang = getLocales()[0]?.languageCode;
        if (phoneLang) {
          setCurrentLocale(phoneLang as Locales);
          updateLanguageMutation(phoneLang);
        }
      });
  }, []);

  return { i18n, t, changeLocale };
};
