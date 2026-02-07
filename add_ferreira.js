/**
 * Script para adicionar ferreira@teste.com na whitelist do Supabase
 * Executa através da API do Supabase usando as credenciais do .env
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFerreiraToWhitelist() {
    console.log('🔄 Adicionando ferreira@teste.com na whitelist...');

    try {
        // Inserir email na whitelist
        const { data, error } = await supabase
            .from('allowed_users')
            .insert([
                { email: 'ferreira@teste.com' }
            ])
            .select();

        if (error) {
            // Se já existe, não é erro crítico
            if (error.code === '23505') {
                console.log('✅ Email ferreira@teste.com já está na whitelist!');
                return;
            }
            throw error;
        }

        console.log('✅ Email ferreira@teste.com adicionado com sucesso!');
        console.log('Dados:', data);

        // Verificar se foi adicionado
        const { data: verification, error: verifyError } = await supabase
            .from('allowed_users')
            .select('*')
            .eq('email', 'ferreira@teste.com')
            .single();

        if (verifyError) {
            throw verifyError;
        }

        console.log('✅ Verificação bem-sucedida:', verification);
        console.log('\n📧 ferreira@teste.com agora pode fazer login no app!');

    } catch (err) {
        console.error('❌ Erro ao adicionar email:', err.message);
        process.exit(1);
    }
}

addFerreiraToWhitelist();
