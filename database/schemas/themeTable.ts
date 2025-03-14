import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const themeTable = sqliteTable('themeTable', {
  currentTheme: text({ enum: ['light', 'dark'] }),
});

export type ThemeTable = typeof themeTable.$inferSelect;
