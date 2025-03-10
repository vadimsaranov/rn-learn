import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const weatherTable = sqliteTable('weather_table', {
  description: text().notNull(),
  icon: text().notNull(),
  id: int().primaryKey({ autoIncrement: true }),
  main: text().notNull(),
});
