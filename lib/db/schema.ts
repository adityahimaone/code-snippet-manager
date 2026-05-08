import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const snippets = sqliteTable('snippets', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code').notNull(),
  language: text('language').notNull(),
  tags: text('tags'), // JSON string array
  sharedAt: integer('shared_at', { mode: 'timestamp' }).notNull(),
});

export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;
