import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';

// Define the absolute path to the database file
const dbPath = path.join(process.cwd(), 'data/database.sqlite');
const dataDirPath = path.join(process.cwd(), 'data');

let dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>> | null = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      // Ensure the data directory exists
      await fs.mkdir(dataDirPath, { recursive: true });

      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      // Initialize the users table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        )
      `);

      // Attempt to migrate existing users from users.json if the table is empty
      try {
        const rowCount = await db.get('SELECT COUNT(*) as count FROM users');
        if (rowCount.count === 0) {
          const usersJsonPath = path.join(process.cwd(), 'data/users.json');
          try {
            const fileContents = await fs.readFile(usersJsonPath, 'utf8');
            const users = JSON.parse(fileContents);
            if (Array.isArray(users) && users.length > 0) {
              const stmt = await db.prepare('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)');
              for (const user of users) {
                // Ignore the id from json to let SQLite auto-increment, or use it if needed.
                // It's safer to let SQLite auto-increment, or insert specifically.
                // We'll just map them. Sometimes ids in json are timestamps.
                await stmt.run([user.id, user.email, user.password, user.role]);
              }
              await stmt.finalize();
              console.log('Migrated users from users.json to sqlite');
            }
          } catch (e: unknown) {
             if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code !== 'ENOENT') {
                 console.error('Error migrating users:', e);
             }
          }
        }
      } catch (err) {
        console.error('Error checking users count for migration:', err);
      }

      return db;
    })();
  }
  return dbPromise;
}
