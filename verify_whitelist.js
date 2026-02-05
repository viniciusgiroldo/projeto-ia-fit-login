import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxnkbfljpgatmwvyusrg.supabase.co';
const supabaseKey = 'sb_publishable_50mUYjQh5MKNFQZzwqeVwg_rXzwVft2';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWhitelist() {
    console.log("Checking whitelist table...");

    const { data, error } = await supabase.from('allowed_users').select('*').limit(5);

    if (error) {
        console.error("❌ ERRO ao acessar allowed_users:", error.message);
    } else {
        console.log("✅ Sucesso! Tabela 'allowed_users' acessível.");
        console.log("Emails na lista:", data);
    }
}

checkWhitelist();
