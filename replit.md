# Setmio development notes

- Run the app in Replit with `bun run dev` (Vite on port 5000).
- Check TypeScript with `bun run lint`; build production assets with `bun run build`.
- The current application is a client-side demonstration. Domain records and editor settings are seeded in `src/data/initialData.ts`; a limited set of edits is stored in this browser's local storage.
- Supabase authentication initialization exists, but bookings, customers, teams, products, payments, and IoT operations are not connected to production services. Do not represent browser-local demo data as shared or production data.
- Keep Supabase/Gemini configuration in Replit Secrets or environment variables; do not commit credentials.