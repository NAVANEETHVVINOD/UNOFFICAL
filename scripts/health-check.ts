// Health Check Script
// Usage: ts-node scripts/health-check.ts
import https from 'https';
import http from 'http';

const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://linker-inky.vercel.app';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://linker-g0lw.onrender.com';

console.log('🏥 Starting Health Check...');
console.log(`Frontend: ${FRONTEND_URL}`);
console.log(`Backend:  ${BACKEND_URL}`);

const checkUrl = (url: string, name: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                console.log(`\x1b[32m✔ ${name} is UP (Status: ${res.statusCode})\x1b[0m`);
                resolve(true);
            } else {
                console.log(`\x1b[31m❌ ${name} returned status ${res.statusCode}\x1b[0m`);
                resolve(false);
            }
        }).on('error', (err) => {
            console.log(`\x1b[31m❌ ${name} incorrect or unreachable: ${err.message}\x1b[0m`);
            resolve(false);
        });
    });
};

const run = async () => {
    const fe = await checkUrl(FRONTEND_URL, 'Frontend');
    // For backend, check root or a health endpoint if it exists. Trying root for now.
    const be = await checkUrl(`${BACKEND_URL}/`, 'Backend API');

    if (fe && be) {
        console.log('\n✅ All systems operational.');
        process.exit(0);
    } else {
        console.log('\n⚠️ Some systems are reporting issues.');
        process.exit(1);
    }
};

run();
