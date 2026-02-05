-- Create the Whitelist table
create table public.allowed_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.allowed_users enable row level security;

-- Policy: Only allow the system (service_role) or potential edge functions to write here.
-- For now, we allow authenticated users to READ (to check if they are allowed) 
-- or we can handle this check on the backend. 
-- For simplicity in the MVP frontend check:
create policy "Anyone can read allowed_users" on public.allowed_users
  for select using (true); 

-- INSERT TEST DATA (Add your test emails here)
insert into public.allowed_users (email)
values 
  ('seu_email@exemplo.com'),
  ('teste@exemplo.com');
