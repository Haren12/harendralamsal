-- Grant admin role to the existing first user (you), and ensure future first user also becomes admin via trigger.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'harendralamsal4140@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Attach the existing first-user-admin function as a trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_first_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_first_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_admin();