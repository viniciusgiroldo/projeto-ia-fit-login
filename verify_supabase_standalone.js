import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Manually load env for this standalone script if needed, or just use the keys I know are correct from context
const supabaseUrl = 'https://bxnkbfljpgatmwvyusrg.supabase.co';
const supabaseKey = 'sb_publishable_50mUYjQh5MKNFQZzwqeVwg_rXzwVft2';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log("Checking connection to Supabase...");

    // Try to select from 'profiles'. 
    // Even with RLS, if the table exists, we shouldn't get a 'relation does not exist' error 404.
    // We might get data: [] because we are anon and RLS is on.
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
        if (error.code === '42P01') { // Postgres code for 'undefined_table'
            console.error("❌ ERRO: A tabela 'profiles' NÃO existe. O script SQL não rodou corretamente.");
        } else {
            console.log("✅ Conexão bem sucedida! (Tabela existe, erro esperado de permissão/RLS ou lista vazia)");
            console.log("Resposta bruta:", error.message);
        }
    } else {
        console.log("✅ Sucesso! Tabela 'profiles' encontrada.");
    }

    // Check 'fitness_plans'
    const { error: errorPlans } = await supabase.from('fitness_plans').select('id').limit(1);
    if (errorPlans && errorPlans.code === '42P01') {
        console.error("❌ ERRO: A tabela 'fitness_plans' NÃO existe.");
    } else {
        console.log("✅ Sucesso! Tabela 'fitness_plans' encontrada.");
    }
}

checkTables();
