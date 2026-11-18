# Problem Solving Lab — learning platform

A Next.js + Supabase application for the 100-hour Problem Solving Lab. This is a review/development build: it is **not deployed**, is **not production-ready**, and its Supabase migrations have **not** yet been applied to a live project.

## What is included

- Public course home page and one-course registration journey.
- Student registration with full name, email, phone, college, register number, department, degree, graduation year and recorded acceptance of the student data notice.
- Email/password authentication through Supabase Auth, including email-confirmation callback.
- Student portal with enrollment status, personal profile, progress summary and sequential learning paths.
- Administrator portal with student records, access assignment/invitations and registration-mode control.
- PostgreSQL schema and Row Level Security (RLS) migration, plus a security review checklist in `SECURITY.md`.
- Secure database functions for enrollment, question submission, scoring and lesson completion.
- Module 01 teaching content reused from the approved single-file curriculum. The protected lesson HTML is served only to authenticated students with course access. Its answer key was removed from the browser-delivered content; the six assessment keys and explanations are seeded into a non-exposed `private` schema.
- Modules 02–100 are catalogue entries only. They remain planned/unpublished until content is authored and reviewed.

## Technology

- Next.js 16 App Router, React 19, TypeScript
- Supabase Auth with `@supabase/ssr` cookie-based sessions
- Supabase PostgreSQL with RLS and security-definer RPCs

The Supabase SSR setup follows the current official pattern: a browser client, server client and Next.js 16 `src/proxy.ts` that refreshes and verifies the session with `auth.getClaims()`. Server pages and database policies also enforce authorization; the proxy is not treated as the security boundary.

## Run locally

Requirements: Node.js 20.9+ (Node 22 recommended), npm, and a Supabase project.

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. In `.env.local`, set:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   The publishable key is intended for browser use. Never place a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable or commit it to Git.

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`.

Without the two Supabase environment variables, the public home page still loads, but login, registration, student data and progress are not activated. The application deliberately does not pretend that browser-only data is stored in the real database.

## Set up the Supabase database

This repository includes reviewed SQL migrations and Module 01 seed data, but no live Supabase project has been connected or migrated yet. Do not apply migrations until the target Supabase project has been selected, reviewed, and explicitly approved.

Using Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --dry-run --remote
npx supabase db push --remote
```

The two versioned migrations create the schema, RLS policies, protected RPCs, the 100-module catalogue and Module 01 question content/answer keys. Only Module 01 is marked `published`. Preview the target with `--dry-run` before applying. The `--remote` flag is deliberate: current Supabase CLI v3 runs database commands against the local stack by default unless a remote target is named. See the current [Supabase CLI v3 guidance](https://supabase.com/docs/guides/local-development/cli/migrating-to-v3).

Alternatively, apply `supabase/migrations/202611180001_initial_schema.sql` and then `supabase/migrations/202611180002_course_catalog_and_module_01.sql` in the Supabase SQL Editor, in that order.

### Auth configuration

In Supabase Dashboard → Authentication → URL Configuration:

- Site URL: `http://localhost:3000` for local testing.
- Redirect URL: `http://localhost:3000/auth/callback`.
- For production, add the production domain and the same `/auth/callback` path.

Keep email confirmation enabled for student registration. Configure SMTP for reliable institutional delivery before opening registration publicly. Add CAPTCHA / bot protection and set appropriate Auth rate limits before production use.

### Create the first administrator

1. Register the intended administrator email through the normal form.
2. Verify the email and sign in once, so the `profiles` and `user_roles` trigger creates the student account.
3. Open Supabase SQL Editor and run `supabase/manual/bootstrap-admin.sql`, replacing `REPLACE_WITH_ADMIN_EMAIL@example.com` with the exact email.
4. Sign out and sign back in. The admin portal will now be available.

Do not add an administrator-role selector to the public registration form. The `user_roles` table has no client-side write policy; role grants are a controlled administrator/database operation.

## Enrollment behaviour

The default registration mode is **approval**:

- `open`: a new student self-registers and receives approved course access.
- `approval`: a new student self-registers and stays pending until an administrator approves the request from the Student Records screen.
- `invite_only`: only an email with a pending admin invitation receives approved access after email verification.

Admins can approve pending registrations, assign access to an existing account by email, or create a pending invitation for a student who has not registered yet. The invite does not send an email by itself; the admin shares the registration URL with that student. A transactional email provider can be added after the first app review.

## Progress and assessment security

- Lesson progress and assessment responses are stored in PostgreSQL, not only `localStorage`.
- Students can read their own profile, enrolment, progress, attempts and submitted responses only.
- Admins can inspect student records through a database role checked on the server and in RLS.
- Correct answers, detailed explanations and answer scoring data live in the non-exposed `private` schema.
- Students cannot directly insert/update roles, enrolments, attempts, responses or completion records. They use constrained RPCs that verify the signed-in user, approved enrolment, lesson sequence, question membership and submitted choices.
- Assessment answers are immutable within an attempt. Failed attempts can be retried with a new attempt.
- Database tests are scaffolded under `supabase/tests/` and can be run with `supabase test db` after installing/configuring the Supabase CLI and local database.

## Verification status for this development build

Checks completed locally:

- `npm install` completed and generated `package-lock.json`.
- `npm run typecheck` (`tsc --noEmit`) passed.
- `npm run lint` (`eslint .`) passed with zero errors and zero warnings.
- `npm run build` (`next build`) succeeded with `src/proxy.ts` active and all authenticated routes configured as dynamic.
- Static course checks confirmed 100 catalogue entries, that only Module 01 is published, and that browser-delivered question/lesson payloads do not expose answer keys or explanations.

Not yet completed:

- Live Supabase migration execution (`supabase db push --dry-run --remote` / `--remote`).
- `supabase test db` (pgTAP) execution against a configured Supabase stack.
- End-to-end tests against live `anon`, student, and admin Supabase Auth sessions.
- Production deployment, SMTP, CAPTCHA, rate limiting, and institutional privacy review.

## Current deployment boundary

- No live Supabase migration has been applied.
- No production database has been modified.
- No site has been deployed.
- Treat this repository as a review/development build, not a production-ready service.

## Security notes before production

This is a development release, not a completed production security audit. Before admitting students, test the RLS policies against real `anon`, student and admin JWTs; test invite-only, approval and open registration; configure SMTP and CAPTCHA; configure database backups; set production redirect URLs; add privacy/retention language; and run `supabase test db`. Do not collect sensitive information that the course does not need.
