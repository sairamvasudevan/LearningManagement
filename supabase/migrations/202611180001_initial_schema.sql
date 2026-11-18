-- Problem Solving Lab: secure multi-user course schema
-- Apply with Supabase CLI v3: supabase db push --remote

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('student', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.registration_mode as enum ('open', 'approval', 'invite_only');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attempt_status as enum ('active', 'passed', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.progress_status as enum ('not_started', 'in_progress', 'completed');
exception when duplicate_object then null; end $$;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  total_hours integer not null default 100 check (total_hours > 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.courses (slug, title, description, total_hours)
values (
  'problem-solving-lab',
  'Problem Solving Lab',
  'A 100-hour, language-independent programme focused on understanding unfamiliar problems, constructing solutions, verifying correctness and exercising engineering judgement.',
  100
)
on conflict (slug) do nothing;

create table if not exists public.course_settings (
  singleton boolean primary key default true check (singleton),
  registration_mode public.registration_mode not null default 'approval',
  pass_percent integer not null default 80 check (pass_percent between 50 and 100),
  allow_student_self_registration boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
insert into public.course_settings (singleton) values (true) on conflict (singleton) do nothing;

create table if not exists public.course_modules (
  module_number integer primary key check (module_number between 1 and 100),
  course_id uuid not null references public.courses(id) on delete cascade,
  stage_number integer not null check (stage_number between 1 and 10),
  title text not null,
  objective text not null,
  focus text not null,
  expected_evidence text not null,
  learning_tier text not null check (learning_tier in ('foundation','building','applied','advanced','synthesis','capstone')),
  content_status text not null default 'planned' check (content_status in ('planned','draft','published','retired')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  register_number text not null,
  department text not null,
  degree text not null,
  graduation_year integer check (graduation_year between 1990 and 2100),
  campus text,
  privacy_notice_accepted_at timestamptz not null default now(),
  privacy_notice_version text not null default '2026-11-v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) between 2 and 120),
  constraint profiles_phone_length check (char_length(phone) between 7 and 24),
  constraint profiles_college_length check (char_length(college) between 2 and 180),
  constraint profiles_register_number_length check (char_length(register_number) between 2 and 60)
);
create unique index if not exists profiles_email_lower_unique on public.profiles (lower(email));
create unique index if not exists profiles_college_register_unique on public.profiles (lower(college), lower(register_number));

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  status public.enrollment_status not null default 'pending',
  access_source text not null check (access_source in ('self_registration','admin_assignment','admin_invite')),
  assigned_by uuid references auth.users(id),
  enrolled_at timestamptz not null default now(),
  approved_at timestamptz,
  unique (course_id, student_id)
);

create table if not exists public.course_invites (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  invited_by uuid not null references auth.users(id),
  status text not null default 'pending' check (status in ('pending','accepted','revoked')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);
create unique index if not exists course_invites_pending_email_unique
  on public.course_invites(course_id, email_normalized) where status = 'pending';

create table if not exists public.lesson_progress (
  student_id uuid not null references auth.users(id) on delete cascade,
  module_number integer not null references public.course_modules(module_number) on delete cascade,
  status public.progress_status not null default 'not_started',
  best_score integer not null default 0 check (best_score >= 0),
  total_marks integer not null default 0 check (total_marks >= 0),
  attempts integer not null default 0 check (attempts >= 0),
  first_started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, module_number),
  check ((status = 'completed' and completed_at is not null) or status <> 'completed')
);

create table if not exists public.course_activities (
  activity_id text primary key,
  module_number integer not null references public.course_modules(module_number) on delete cascade,
  sort_order integer not null,
  title text not null,
  unique(module_number, sort_order)
);

create table if not exists public.lesson_activity_responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  module_number integer not null references public.course_modules(module_number) on delete cascade,
  activity_id text not null references public.course_activities(activity_id) on delete cascade,
  response text not null check (char_length(response) <= 5000),
  updated_at timestamptz not null default now(),
  unique(student_id, activity_id)
);

create table if not exists public.assessment_questions (
  question_id text primary key,
  module_number integer not null references public.course_modules(module_number) on delete cascade,
  sort_order integer not null,
  title text not null,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  hints jsonb not null check (jsonb_typeof(hints) = 'array' and jsonb_array_length(hints) = 3),
  marks integer not null default 2 check (marks between 1 and 10),
  is_published boolean not null default true,
  unique(module_number, sort_order)
);

create table if not exists private.assessment_answer_keys (
  question_id text primary key references public.assessment_questions(question_id) on delete cascade,
  correct_index smallint not null check (correct_index between 0 and 3),
  explanation text not null,
  option_explanations jsonb not null check (jsonb_typeof(option_explanations) = 'array' and jsonb_array_length(option_explanations) = 4)
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  module_number integer not null references public.course_modules(module_number) on delete cascade,
  status public.attempt_status not null default 'active',
  score integer not null default 0 check (score >= 0),
  total_marks integer not null default 0 check (total_marks >= 0),
  pass_percent integer not null default 80 check (pass_percent between 50 and 100),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique (id, student_id)
);
create index if not exists assessment_attempts_student_module_idx
  on public.assessment_attempts(student_id, module_number, started_at desc);

create table if not exists public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.assessment_questions(question_id) on delete cascade,
  selected_index smallint not null check (selected_index between 0 and 3),
  is_correct boolean not null,
  marks_awarded integer not null check (marks_awarded >= 0),
  submitted_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);
create index if not exists assessment_responses_student_idx on public.assessment_responses(student_id, submitted_at desc);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  event_type text not null,
  target_user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.user_roles r
    where r.user_id = (select auth.uid()) and r.role = 'admin'
  );
$$;

create or replace function public.has_active_enrollment()
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.course_enrollments e
    join public.courses c on c.id = e.course_id
    where e.student_id = (select auth.uid())
      and e.status = 'approved'
      and c.slug = 'problem-solving-lab'
  );
$$;

create or replace function public.can_access_module(p_module_number integer)
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select public.has_active_enrollment()
    and exists (
      select 1 from public.course_modules m
      where m.module_number = p_module_number and m.content_status = 'published'
    )
    and (
      p_module_number = 1
      or exists (
        select 1 from public.lesson_progress lp
        where lp.student_id = (select auth.uid())
          and lp.module_number = p_module_number - 1
          and lp.status = 'completed'
      )
    );
$$;

create or replace function public.start_lesson(p_module_number integer)
returns void
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if not public.can_access_module(p_module_number) then raise exception 'This lesson is locked or unavailable'; end if;
  insert into public.lesson_progress(student_id,module_number,status,first_started_at,updated_at)
  values ((select auth.uid()),p_module_number,'in_progress',now(),now())
  on conflict (student_id,module_number) do update set
    status=case when public.lesson_progress.status='completed' then 'completed'::public.progress_status else 'in_progress'::public.progress_status end,
    first_started_at=coalesce(public.lesson_progress.first_started_at,now()),updated_at=now();
end;
$$;

create or replace function public.save_lesson_activity(p_module_number integer,p_activity_id text,p_response text)
returns void
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  if not public.can_access_module(p_module_number) then raise exception 'This lesson is locked or unavailable'; end if;
  if p_response is null or char_length(p_response)>5000 then raise exception 'Response must be 5000 characters or fewer'; end if;
  if not exists(select 1 from public.course_activities where activity_id=p_activity_id and module_number=p_module_number) then
    raise exception 'Activity is not part of this lesson';
  end if;
  insert into public.lesson_activity_responses(student_id,module_number,activity_id,response,updated_at)
  values ((select auth.uid()),p_module_number,p_activity_id,p_response,now())
  on conflict (student_id,activity_id) do update set response=excluded.response,updated_at=now();
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if new.email is null or
     length(trim(coalesce(new.raw_user_meta_data ->> 'full_name',''))) < 2 or
     length(trim(coalesce(new.raw_user_meta_data ->> 'phone',''))) < 7 or
     length(trim(coalesce(new.raw_user_meta_data ->> 'college',''))) < 2 or
     length(trim(coalesce(new.raw_user_meta_data ->> 'register_number',''))) < 2 or
     length(trim(coalesce(new.raw_user_meta_data ->> 'department',''))) < 2 or
     length(trim(coalesce(new.raw_user_meta_data ->> 'degree',''))) < 2 or
     coalesce(new.raw_user_meta_data ->> 'privacy_notice_accepted','false') <> 'true' then
    raise exception 'Complete all required student profile fields before registering';
  end if;

  insert into public.profiles (
    id, full_name, email, phone, college, register_number, department, degree, graduation_year,
    privacy_notice_accepted_at, privacy_notice_version
  ) values (
    new.id,
    trim(new.raw_user_meta_data ->> 'full_name'),
    lower(new.email),
    trim(new.raw_user_meta_data ->> 'phone'),
    trim(new.raw_user_meta_data ->> 'college'),
    trim(new.raw_user_meta_data ->> 'register_number'),
    trim(new.raw_user_meta_data ->> 'department'),
    trim(new.raw_user_meta_data ->> 'degree'),
    case when coalesce(new.raw_user_meta_data ->> 'graduation_year','') ~ '^(19[9][0-9]|20[0-9]{2}|2100)$'
      then (new.raw_user_meta_data ->> 'graduation_year')::integer else null end,
    now(), '2026-11-v1'
  ) on conflict (id) do update set email = excluded.email, updated_at = now();

  insert into public.user_roles(user_id, role) values (new.id, 'student')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_problem_solving_lab on auth.users;
create trigger on_auth_user_created_problem_solving_lab
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.handle_auth_email_update()
returns trigger
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email=lower(new.email), updated_at=now() where id=new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated_problem_solving_lab on auth.users;
create trigger on_auth_user_email_updated_problem_solving_lab
after update of email on auth.users
for each row execute function public.handle_auth_email_update();

create or replace function public.request_course_enrollment()
returns jsonb
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_course_id uuid;
  v_email text;
  v_mode public.registration_mode;
  v_existing public.enrollment_status;
  v_invite_id uuid;
  v_status public.enrollment_status;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select id into v_course_id from public.courses where slug = 'problem-solving-lab' and is_published;
  if v_course_id is null then raise exception 'Course is unavailable'; end if;
  select lower(email) into v_email from public.profiles where id = v_user_id;
  if v_email is null then raise exception 'Student profile is incomplete'; end if;

  select status into v_existing from public.course_enrollments
  where course_id = v_course_id and student_id = v_user_id;
  if v_existing is not null then return jsonb_build_object('status', v_existing); end if;

  select id into v_invite_id from public.course_invites
  where course_id = v_course_id and email_normalized = v_email and status = 'pending'
  limit 1;
  if v_invite_id is not null then
    insert into public.course_enrollments(course_id, student_id, status, access_source)
    values (v_course_id, v_user_id, 'approved', 'admin_invite')
    on conflict (course_id, student_id) do nothing;
    update public.course_invites set status = 'accepted', accepted_at = now() where id = v_invite_id;
    return jsonb_build_object('status', 'approved', 'source', 'admin_invite');
  end if;

  select registration_mode into v_mode from public.course_settings where singleton = true;
  if v_mode = 'invite_only' then
    raise exception 'This course currently requires an administrator invitation';
  end if;
  if v_mode = 'open' then v_status := 'approved'; else v_status := 'pending'; end if;
  insert into public.course_enrollments(course_id, student_id, status, access_source, approved_at)
  values (v_course_id, v_user_id, v_status, 'self_registration', case when v_status = 'approved' then now() else null end)
  on conflict (course_id, student_id) do nothing;
  return jsonb_build_object('status', v_status, 'source', 'self_registration');
end;
$$;

create or replace function public.admin_assign_course(p_email text)
returns jsonb
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_admin uuid := (select auth.uid());
  v_course_id uuid;
  v_student_id uuid;
  v_email text := lower(trim(p_email));
begin
  if v_admin is null or not public.is_admin() then raise exception 'Administrator access required'; end if;
  if v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then raise exception 'Enter a valid email address'; end if;
  select id into v_course_id from public.courses where slug = 'problem-solving-lab';
  select id into v_student_id from auth.users where lower(email) = v_email limit 1;
  if v_student_id is not null then
    insert into public.course_enrollments(course_id, student_id, status, access_source, assigned_by, approved_at)
    values (v_course_id, v_student_id, 'approved', 'admin_assignment', v_admin, now())
    on conflict (course_id, student_id) do update
      set status = 'approved', access_source = 'admin_assignment', assigned_by = v_admin, approved_at = now();
    insert into public.audit_events(actor_id,event_type,target_user_id,metadata)
    values (v_admin,'course.assigned',v_student_id,jsonb_build_object('email',v_email));
    return jsonb_build_object('result','assigned','email',v_email);
  else
    insert into public.course_invites(course_id,email,invited_by,status)
    values (v_course_id,v_email,v_admin,'pending')
    on conflict (course_id,email_normalized) where status='pending' do nothing;
    insert into public.audit_events(actor_id,event_type,metadata)
    values (v_admin,'course.invited',jsonb_build_object('email',v_email));
    return jsonb_build_object('result','invited','email',v_email,'message','Share the registration link with this email address. Access will be granted when the invited student registers.');
  end if;
end;
$$;

create or replace function public.admin_approve_course_enrollment(p_student_id uuid)
returns void
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_admin uuid := (select auth.uid());
  v_course_id uuid;
begin
  if v_admin is null or not public.is_admin() then raise exception 'Administrator access required'; end if;
  select id into v_course_id from public.courses where slug = 'problem-solving-lab';
  update public.course_enrollments
    set status='approved', assigned_by=v_admin, approved_at=now()
    where course_id=v_course_id and student_id=p_student_id and status='pending';
  if not found then raise exception 'No pending course registration found for this student'; end if;
  insert into public.audit_events(actor_id,event_type,target_user_id)
  values (v_admin,'course.enrollment_approved',p_student_id);
end;
$$;

create or replace function public.set_course_registration_mode(p_mode public.registration_mode)
returns void
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if (select auth.uid()) is null or not public.is_admin() then raise exception 'Administrator access required'; end if;
  update public.course_settings set registration_mode = p_mode, updated_at = now(), updated_by = (select auth.uid()) where singleton = true;
  insert into public.audit_events(actor_id,event_type,metadata)
  values ((select auth.uid()),'course.registration_mode_changed',jsonb_build_object('mode',p_mode));
end;
$$;

create or replace function public.start_module_assessment(p_module_number integer)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt_id uuid;
  v_pass_percent integer;
begin
  if not public.can_access_module(p_module_number) then raise exception 'This lesson is locked or unavailable'; end if;
  if not exists(select 1 from public.assessment_questions where module_number=p_module_number and is_published) then
    raise exception 'Assessment content is not published yet';
  end if;
  select id into v_attempt_id from public.assessment_attempts
  where student_id=(select auth.uid()) and module_number=p_module_number and status='active'
  order by started_at desc limit 1;
  if v_attempt_id is not null then return v_attempt_id; end if;
  select pass_percent into v_pass_percent from public.course_settings where singleton=true;
  insert into public.assessment_attempts(student_id,module_number,pass_percent)
  values ((select auth.uid()),p_module_number,coalesce(v_pass_percent,80)) returning id into v_attempt_id;
  return v_attempt_id;
end;
$$;

create or replace function public.submit_assessment_answer(p_attempt_id uuid,p_question_id text,p_selected_index smallint)
returns jsonb
language plpgsql security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_attempt public.assessment_attempts%rowtype;
  v_question public.assessment_questions%rowtype;
  v_key private.assessment_answer_keys%rowtype;
  v_existing public.assessment_responses%rowtype;
  v_correct boolean;
  v_marks integer;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  select * into v_attempt from public.assessment_attempts
  where id=p_attempt_id and student_id=(select auth.uid()) for update;
  if not found or v_attempt.status <> 'active' then raise exception 'Assessment attempt is not active'; end if;
  if not public.can_access_module(v_attempt.module_number) then raise exception 'Course access has been revoked or the lesson is locked'; end if;
  select * into v_question from public.assessment_questions
  where question_id=p_question_id and module_number=v_attempt.module_number and is_published;
  if not found then raise exception 'Question is not part of this assessment'; end if;
  if p_selected_index < 0 or p_selected_index > 3 then raise exception 'Invalid answer option'; end if;
  select * into v_key from private.assessment_answer_keys where question_id=p_question_id;
  if not found then raise exception 'Question answer key is unavailable'; end if;

  select * into v_existing from public.assessment_responses
  where attempt_id=p_attempt_id and question_id=p_question_id;
  if found then
    return jsonb_build_object(
      'already_submitted',true,'is_correct',v_existing.is_correct,
      'selected_index',v_existing.selected_index,'correct_index',v_key.correct_index,
      'marks_awarded',v_existing.marks_awarded,'max_marks',v_question.marks,
      'explanation',v_key.explanation,'option_explanations',v_key.option_explanations
    );
  end if;

  v_correct := (p_selected_index = v_key.correct_index);
  v_marks := case when v_correct then v_question.marks else 0 end;
  insert into public.assessment_responses(attempt_id,student_id,question_id,selected_index,is_correct,marks_awarded)
  values (p_attempt_id,(select auth.uid()),p_question_id,p_selected_index,v_correct,v_marks);
  return jsonb_build_object(
    'already_submitted',false,'is_correct',v_correct,
    'selected_index',p_selected_index,'correct_index',v_key.correct_index,
    'marks_awarded',v_marks,'max_marks',v_question.marks,
    'explanation',v_key.explanation,'option_explanations',v_key.option_explanations
  );
end;
$$;

create or replace function public.finalize_module_assessment(p_attempt_id uuid)
returns jsonb
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.assessment_attempts%rowtype;
  v_question_count integer;
  v_response_count integer;
  v_score integer;
  v_total integer;
  v_passed boolean;
begin
  select * into v_attempt from public.assessment_attempts
  where id=p_attempt_id and student_id=(select auth.uid()) for update;
  if not found or v_attempt.status <> 'active' then raise exception 'Assessment attempt is not active'; end if;
  if not public.can_access_module(v_attempt.module_number) then raise exception 'Course access has been revoked or the lesson is locked'; end if;
  select count(*), coalesce(sum(marks),0) into v_question_count,v_total
  from public.assessment_questions where module_number=v_attempt.module_number and is_published;
  select count(*),coalesce(sum(marks_awarded),0) into v_response_count,v_score
  from public.assessment_responses where attempt_id=p_attempt_id and student_id=(select auth.uid());
  if v_question_count=0 or v_response_count<>v_question_count then raise exception 'Submit every question before finishing'; end if;
  v_passed := (v_score * 100 >= v_total * v_attempt.pass_percent);
  update public.assessment_attempts set
    status=case when v_passed then 'passed'::public.attempt_status else 'failed'::public.attempt_status end,
    score=v_score,total_marks=v_total,submitted_at=now()
  where id=p_attempt_id;
  insert into public.lesson_progress(student_id,module_number,status,best_score,total_marks,attempts,first_started_at,completed_at,updated_at)
  values ((select auth.uid()),v_attempt.module_number,
    case when v_passed then 'completed'::public.progress_status else 'in_progress'::public.progress_status end,
    v_score,v_total,1,v_attempt.started_at,case when v_passed then now() else null end,now())
  on conflict (student_id,module_number) do update set
    status=case when public.lesson_progress.status='completed' or v_passed then 'completed'::public.progress_status else 'in_progress'::public.progress_status end,
    best_score=greatest(public.lesson_progress.best_score,excluded.best_score),
    total_marks=excluded.total_marks,
    attempts=public.lesson_progress.attempts+1,
    completed_at=case when public.lesson_progress.status='completed' or v_passed then coalesce(public.lesson_progress.completed_at,now()) else null end,
    updated_at=now();
  return jsonb_build_object('score',v_score,'total_marks',v_total,'pass_percent',v_attempt.pass_percent,'passed',v_passed,'module_number',v_attempt.module_number);
end;
$$;

-- Enable RLS on every exposed application table.
alter table public.courses enable row level security;
alter table public.course_settings enable row level security;
alter table public.course_modules enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.course_invites enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.course_activities enable row level security;
alter table public.lesson_activity_responses enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.audit_events enable row level security;
alter table private.assessment_answer_keys enable row level security;

-- Profiles: students can read and edit only their own permitted profile fields; admins can manage profiles.
create policy "profiles_select_self_or_admin" on public.profiles for select to authenticated
using (id=(select auth.uid()) or public.is_admin());
create policy "profiles_update_self_or_admin" on public.profiles for update to authenticated
using (id=(select auth.uid()) or public.is_admin())
with check (id=(select auth.uid()) or public.is_admin());
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name,phone,college,register_number,department,degree,graduation_year,campus,updated_at) on public.profiles to authenticated;

create policy "roles_select_self_or_admin" on public.user_roles for select to authenticated
using (user_id=(select auth.uid()) or public.is_admin());

create policy "published_courses_read" on public.courses for select to anon, authenticated
using (is_published);
create policy "registration_mode_admin_read" on public.course_settings for select to authenticated
using (public.is_admin());
create policy "modules_read_for_enrolled" on public.course_modules for select to authenticated
using (public.has_active_enrollment() or public.is_admin());
create policy "enrollments_select_self_or_admin" on public.course_enrollments for select to authenticated
using (student_id=(select auth.uid()) or public.is_admin());
create policy "invites_admin_only" on public.course_invites for select to authenticated using (public.is_admin());
create policy "progress_select_self_or_admin" on public.lesson_progress for select to authenticated
using (student_id=(select auth.uid()) or public.is_admin());
create policy "questions_read_unlocked_module" on public.assessment_questions for select to authenticated
using (public.is_admin() or (is_published and public.can_access_module(module_number)));
create policy "activities_read_unlocked_module" on public.course_activities for select to authenticated
using (public.is_admin() or public.can_access_module(module_number));
create policy "activity_responses_select_self_or_admin" on public.lesson_activity_responses for select to authenticated
using (student_id=(select auth.uid()) or public.is_admin());
create policy "attempts_select_self_or_admin" on public.assessment_attempts for select to authenticated
using (student_id=(select auth.uid()) or public.is_admin());
create policy "responses_select_self_or_admin" on public.assessment_responses for select to authenticated
using (student_id=(select auth.uid()) or public.is_admin());
create policy "audit_admin_read" on public.audit_events for select to authenticated using (public.is_admin());

-- Start from no table privileges for client roles, then grant the minimum required operations.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;
grant select on public.courses to anon, authenticated;
grant select on public.course_settings to authenticated;
grant select on public.profiles, public.user_roles, public.course_enrollments,
  public.course_invites, public.lesson_progress, public.assessment_attempts,
  public.assessment_responses, public.lesson_activity_responses, public.audit_events to authenticated;
grant select on public.course_modules, public.assessment_questions, public.course_activities to authenticated;
grant update (full_name,phone,college,register_number,department,degree,graduation_year,campus,updated_at)
  on public.profiles to authenticated;
revoke all on private.assessment_answer_keys from anon, authenticated;

-- Only vetted RPCs can mutate sensitive learning and access records.
revoke all on function public.is_admin() from public, anon;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.handle_auth_email_update() from public, anon, authenticated;
revoke all on function public.has_active_enrollment() from public, anon;
revoke all on function public.can_access_module(integer) from public, anon;
revoke all on function public.request_course_enrollment() from public, anon;
revoke all on function public.admin_assign_course(text) from public, anon;
revoke all on function public.set_course_registration_mode(public.registration_mode) from public, anon;
revoke all on function public.admin_approve_course_enrollment(uuid) from public, anon;
revoke all on function public.start_lesson(integer) from public, anon;
revoke all on function public.save_lesson_activity(integer,text,text) from public, anon;
revoke all on function public.start_module_assessment(integer) from public, anon;
revoke all on function public.submit_assessment_answer(uuid,text,smallint) from public, anon;
revoke all on function public.finalize_module_assessment(uuid) from public, anon;
grant execute on function public.is_admin(), public.has_active_enrollment(), public.can_access_module(integer) to authenticated;
grant execute on function public.request_course_enrollment(), public.start_lesson(integer),
  public.save_lesson_activity(integer,text,text), public.start_module_assessment(integer),
  public.submit_assessment_answer(uuid,text,smallint), public.finalize_module_assessment(uuid) to authenticated;
grant execute on function public.admin_assign_course(text), public.set_course_registration_mode(public.registration_mode), public.admin_approve_course_enrollment(uuid) to authenticated;

-- The role table is deliberately not writable by students. Bootstrap the first admin manually
-- through the Supabase SQL Editor after registering that email; see README.md.
