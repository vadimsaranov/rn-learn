import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const languageTable = sqliteTable('language_table', {
  language: text().notNull().default('en'),
});

export type LanguageTable = typeof languageTable.$inferSelect;
