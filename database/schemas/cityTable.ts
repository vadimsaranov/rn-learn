import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { weatherTable } from './weatherTable';

export const cityTable = sqliteTable('city_table', {
  id: text().primaryKey(),
  name: text().notNull(),
  weather_id: int()
    .notNull()
    .references(() => weatherTable.id),
  temp: int().notNull(),
  icon: text().notNull(),
  humidity: int().notNull(),
  pressure: int().notNull(),
  wind: int(),
  cloudCover: int(),
  isFavorite: int({ mode: 'boolean' }).notNull().default(false),
});

export type CityTable = typeof cityTable.$inferSelect;
