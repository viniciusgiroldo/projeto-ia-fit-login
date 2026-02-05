-- Insert new test users
insert into public.allowed_users (email)
values 
  ('malu@teste.com'),
  ('joao@teste.com'),
  ('andre@teste.com'),
  ('vinicius@teste.com'),
  ('bia@teste.com')
on conflict (email) do nothing; -- Evita erro se já existir algum
