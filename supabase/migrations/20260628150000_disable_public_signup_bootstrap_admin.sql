-- Public signup is disabled in application code and Supabase auth config.
-- Remove the legacy bootstrap path where the first registered user became admin.
DROP TRIGGER IF EXISTS on_auth_user_created_first_admin ON auth.users;
DROP FUNCTION IF EXISTS public.handle_first_user_admin();

-- Administrator accounts and roles must now be managed manually by an existing
-- administrator or directly in the database via service-role access.
