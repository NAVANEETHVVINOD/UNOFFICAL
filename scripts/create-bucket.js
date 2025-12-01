const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in apps/server/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
    console.log('🛠️ Creating "uploads" bucket...');

    const { data, error } = await supabase.storage.createBucket('uploads', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    });

    if (error) {
        console.error('❌ Error creating bucket:', error.message);
    } else {
        console.log('✅ Bucket "uploads" created successfully!');
        console.log('   - Public: true');
        console.log('   - Size Limit: 5MB');
    }
}

createBucket();
