# Problem Solving Lab — application architecture

## Application surfaces

| Surface | Purpose | Access |
|---|---|---|
| `/` | Public home page for the single course | Public |
| `/register` | Student account registration and consent | Public |
| `/login` | Student/admin sign-in | Public |
| `/portal` | Student profile, enrolment status, progress and next lesson | Signed-in student |
| `/learn/[moduleNumber]` | Published lesson and assessment | Signed-in student with approved enrolment and sequential unlock |
| `/admin` | Course administration overview | Administrator |
| `/admin/students` | Student profile, contact, enrolment and course-progress records | Administrator |
| `/admin/access` | Assign/invite students and set registration mode | Administrator |
| `/privacy` | Development student-data notice | Public |

## Student information stored

`public.profiles` stores the student's Auth user ID, full name, email, phone, college/university, register number, department, degree/programme, optional graduation year, optional campus, privacy-notice acceptance timestamp/version, and timestamps.

The authentication password is managed by Supabase Auth. It is not stored in `public.profiles`.

Learning records are separated into:

- `course_enrollments`: course access, approval status and assignment source.
- `lesson_progress`: each module's state, best score, total marks, attempts and completion date.
- `lesson_activity_responses`: the student's saved written responses.
- `assessment_attempts`: assessment-level score, pass state and timestamps.
- `assessment_responses`: submitted options, correctness and marks per question.
- `audit_events`: administrator activity such as approvals, invitations and registration-mode changes.

## Roles and access

| Capability | Anonymous | Student | Admin |
|---|---:|---:|---:|
| View public course home | Yes | Yes | Yes |
| Register a student account | Yes, subject to registration mode | N/A | N/A |
| Read own profile | No | Yes | Yes |
| Read another student's profile | No | No | Yes |
| Read own enrolment/progress/answers | No | Yes | Yes |
| Read another student's learning record | No | No | Yes |
| Start an approved and unlocked lesson | No | Yes | Admin-only course management |
| Submit and score assessment answers | No | Own attempts only | Not through student scoring UI |
| Approve or assign course access | No | No | Yes |
| Change registration mode | No | No | Yes |
| Grant administrator role through public UI | No | No | No; trusted database operation only |

The administrator role is intentionally not selectable during public registration.

## Enrollment modes

- `open`: a student who registers receives course access after the authentication flow completes.
- `approval`: a student registers, but an administrator must approve course access.
- `invite_only`: only an email address with a pending administrator-created invitation receives course access.

The initial setting is `approval`.

## Sequential lesson access

Only Module 01 is seeded as `published`. A database function checks active enrolment, publication status and completion of the immediately preceding module before granting access. Modules 02–100 remain planned and inaccessible until content is authored, reviewed, seeded and published.

Assessment scoring happens inside a constrained database function. Correct indices and detailed explanations are stored in the non-exposed `private.assessment_answer_keys` table. The browser receives question text, answer options and hints, then receives marks and explanations only after its answer has been submitted.

## Review and deployment flow

1. Review this source package and the application screens.
2. Configure `.env.local` with the selected Supabase project's URL and publishable key.
3. Apply the migration and seed to a non-production Supabase project.
4. Run pgTAP tests and real-user RLS tests for anonymous, student and admin accounts.
5. Configure SMTP, Auth redirect URLs, CAPTCHA/bot protection, backups and the institution-approved privacy notice.
6. Run dependency installation, lint, typecheck, production build and end-to-end tests.
7. Obtain the owner's explicit approval before any GitHub commit or push.

No live database migration or hosting deployment has been performed for this development build.
