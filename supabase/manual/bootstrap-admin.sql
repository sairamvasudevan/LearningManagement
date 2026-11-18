-- Run this manually in Supabase SQL Editor only after the intended administrator has registered.
-- Replace the email below. Do not expose admin role selection in the public registration form.
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = lower('REPLACE_WITH_ADMIN_EMAIL@example.com')
on conflict (user_id) do update set role = 'admin', granted_at = now();
