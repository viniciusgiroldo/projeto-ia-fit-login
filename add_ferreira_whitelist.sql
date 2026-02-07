-- Adicionar ferreira@teste.com na whitelist
-- Execute este script no Supabase SQL Editor

INSERT INTO public.allowed_users (email)
VALUES ('ferreira@teste.com')
ON CONFLICT (email) DO NOTHING;

-- Verificar se foi adicionado com sucesso
SELECT * FROM public.allowed_users WHERE email = 'ferreira@teste.com';
