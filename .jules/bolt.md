## 2026-05-02 - [Database Query Optimization]
**Learning:** Over-fetching from the database and relying on client-side `.slice()` for pagination is a common performance anti-pattern. Next.js API Routes and SQLite provide an efficient way to filter records using `LIMIT` to reduce both memory overhead on the server and JSON payload size transferred over the network.
**Action:** Always check if a client-side `.slice()` on fetched data can be pushed down to the database level using a `limit` query parameter, especially for data displayed on landing pages.
