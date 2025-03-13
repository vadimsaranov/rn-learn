import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('userTable', {
  id: text().notNull(),
  email: text().notNull(),
  rememberUser: int({ mode: 'boolean' }).notNull().default(false),
});

export type UserTable = typeof userTable.$inferSelect;
