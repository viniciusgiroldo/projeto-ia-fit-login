-- 1. Create Tables (if they don't exist)
create table if not exists public.anamneses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.fitness_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_data jsonb not null,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.anamneses enable row level security;
alter table public.fitness_plans enable row level security;

-- 3. Create Policies (Drop first to avoid errors if they exist)
drop policy if exists "Users can view own anamnese" on public.anamneses;
create policy "Users can view own anamnese" on public.anamneses for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own anamnese" on public.anamneses;
create policy "Users can insert own anamnese" on public.anamneses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own anamnese" on public.anamneses;
create policy "Users can update own anamnese" on public.anamneses for update using (auth.uid() = user_id);

drop policy if exists "Users can view own plans" on public.fitness_plans;
create policy "Users can view own plans" on public.fitness_plans for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own plans" on public.fitness_plans;
create policy "Users can insert own plans" on public.fitness_plans for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own plans" on public.fitness_plans;
create policy "Users can update own plans" on public.fitness_plans for update using (auth.uid() = user_id);

-- 4. Grant Permissions (The 'Fix' for the cache error)
GRANT ALL ON TABLE public.anamneses TO authenticated;
GRANT ALL ON TABLE public.anamneses TO service_role;
GRANT ALL ON TABLE public.fitness_plans TO authenticated;
GRANT ALL ON TABLE public.fitness_plans TO service_role;

-- 5. Reload Cache
NOTIFY pgrst, 'reload config';
