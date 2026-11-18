# Problem Solving Lab — 100-hour learning platform

This repository contains the reviewed source package for the Problem Solving Lab learning platform.

## Source package layout

The source archive is stored under `source-archive/` as 13 numbered Base64 text segments. This is a transport format used for the initial repository import; the extracted application is a normal Next.js project.

To reconstruct the source tree, run:

```bash
python3 source-archive/restore.py
cd problem-solving-lab-platform
```

The restore script checks the reconstructed archive SHA-256 before extracting it.

## Run locally

1. Reconstruct the source archive using the command above.
2. Install Node.js matching the version in `.nvmrc`.
3. Copy `.env.example` to `.env.local` and fill in the Supabase project values.
4. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Backend setup

The `supabase/migrations/` directory contains the database schema and course-content migrations. The SQL migrations have **not** been applied to a live Supabase project as part of this repository import. Review the target project and migrations before applying them.

The initial administrator is configured separately using `supabase/manual/bootstrap-admin.sql`; do not expose a service-role key in browser code or commit credentials.

## Current delivery status

- Application source and Module 01 are included in the archive.
- Supabase schema migrations, RLS policies and a smoke-test SQL file are included.
- No production deployment has been performed.
- No Supabase migration has been applied to a live project.
- No secrets or `.env.local` file are included.

See `problem-solving-lab-platform/README.md`, `SECURITY.md` and `docs/ARCHITECTURE.md` after extraction for project-specific details.
