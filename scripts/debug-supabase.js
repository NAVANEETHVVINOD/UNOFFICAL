const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in apps/server/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listBuckets() {
    console.log('🔍 Connecting to Supabase...');
    console.log(`   URL: ${supabaseUrl}`);

    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ Error listing buckets:', error.message);
    } else {
        console.log('✅ Connected! Available Buckets:');
        if (data.length === 0) {
            console.log('   (No buckets found)');
        } else {
            data.forEach(b => {
                console.log(`   - ${b.name} (Public: ${b.public})`);
            });
        }
    }
}

listBuckets();
