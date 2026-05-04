import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';

const dbPath = path.join(process.cwd(), 'data/database.sqlite');
const dataDirPath = path.join(process.cwd(), 'data');

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      await fs.mkdir(dataDirPath, { recursive: true });

      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });

      await db.exec('PRAGMA journal_mode = WAL;');

      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          is_active INTEGER NOT NULL DEFAULT 1
        )
      `);

      // Ensure the is_active column exists for older databases.
      // SQLite does not support IF NOT EXISTS for ALTER TABLE, so we attempt the
      // addition and silently ignore the error that occurs when the column is
      // already present.
      try {
        await db.exec('ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1');
      } catch (e) {
        // If the column already exists SQLite throws "duplicate column" error.
        // We ignore that specific case; any other error is logged.
        if (e && typeof e === 'object' && 'message' in e && !(e.message as string).includes('duplicate column')) {
          console.error('Error ensuring is_active column:', e);
        }
      }

      // Ensure created_at and updated_at columns exist for older databases.
      // SQLite cannot add a NOT NULL column with a non‑constant default to a table
      // that already contains rows, so we add them as nullable first, then back‑fill.
      const addNullableTimestamp = async (col: string) => {
        try {
          await db.exec(`ALTER TABLE users ADD COLUMN ${col} INTEGER`);
        } catch (e) {
          // Ignore duplicate‑column errors; log any other issue.
          if (e && typeof e === 'object' && 'message' in e && !(e.message as string).includes('duplicate column')) {
            console.error(`Error adding ${col} column:`, e);
          }
        }
      };

      // Add nullable columns (if they don't already exist)
      await addNullableTimestamp('created_at');
      await addNullableTimestamp('updated_at');

      // Back‑fill existing rows with the current timestamp (ms since epoch)
      const nowMs = Date.now();
      try {
        await db.exec(`UPDATE users SET created_at = ${nowMs} WHERE created_at IS NULL`);
        await db.exec(`UPDATE users SET updated_at = ${nowMs} WHERE updated_at IS NULL`);
      } catch (e) {
        console.error('Error back‑filling timestamp columns:', e);
      }

      await db.exec(`
        CREATE TABLE IF NOT EXISTS auth_otps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          otp TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          used INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL
        )
      `);

      try {
        const rowCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM users');
        if (rowCount && rowCount.count === 0) {
          const usersJsonPath = path.join(process.cwd(), 'data/users.json');
          try {
            const fileContents = await fs.readFile(usersJsonPath, 'utf8');
            const users = JSON.parse(fileContents);
            if (Array.isArray(users) && users.length > 0) {
              const now = Date.now();
              const stmt = await db.prepare(
                'INSERT INTO users (id, email, password, role, created_at, updated_at, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)'
              );
              for (const user of users) {
                await stmt.run([user.id, user.email, user.password, user.role, now, now]);
              }
              await stmt.finalize();
              console.log('Migrated users from users.json to sqlite');
            }
          } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'ENOENT') {
              // No initial users to migrate.
            } else {
              console.error('Error migrating users:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking users count for migration:', error);
      }

      return db;
    })();
  }

  return dbPromise;
}
