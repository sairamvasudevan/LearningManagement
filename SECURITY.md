# Security model and pre-launch checklist

This project is a review build. Its security controls are implemented in application code and SQL migrations, but the hosted deployment has not been configured or independently penetration-tested.

## Trust boundaries

- Supabase Auth is the identity provider. Public registration always creates a `student` role; the browser cannot choose an administrator role.
- Administrator privileges are granted separately by a trusted database administrator using `supabase/manual/bootstrap-admin.sql`.
- Server components and protected routes verify the authenticated identity. `src/proxy.ts` refreshes the cookie session but is not the sole authorization boundary.
- PostgreSQL Row Level Security protects profile, enrolment, progress, assessment and administrative records.
- Students cannot directly write role, enrolment, assessment-attempt, assessment-response or lesson-progress rows. Narrow security-definer functions validate the current user and requested operation.
- Correct answers and option explanations are stored in the non-exposed `private` schema. The browser receives only question prompts, options and hints before submission. The scoring function returns explanations only after a submitted answer.
- Private lesson HTML is served only after server-side authentication and an enrolment/sequence check. The route is no-store and same-origin framed.
- Written activity responses are saved through a database RPC. Local browser state is keyed by the authenticated student ID to prevent one learner's draft cache appearing in another learner's session.
- Administrative mutation routes require same-origin requests; the database RPCs independently enforce administrator role checks.

## Before production

1. Apply both versioned migrations to a non-production Supabase project first.
2. Run `supabase test db` and add role-matrix tests using real anonymous, student and administrator JWTs.
3. Test that Student A cannot read Student B's profile, activity responses, assessment history or progress, and that a student cannot call any admin RPC.
4. Test registration in `open`, `approval` and `invite_only` modes, including invited and non-invited emails.
5. Configure email confirmation, institutional SMTP, CAPTCHA/bot protection and authentication rate limits.
6. Set trusted production redirect URLs, HTTPS, backups, monitoring and a documented incident process.
7. Have the institution approve the privacy notice, retention/deletion schedule and a student-data contact.
8. Run dependency scanning, static analysis and an independent security review before admitting real students.

Never commit `.env.local`, a Supabase secret/service-role key, student exports or production database dumps.
