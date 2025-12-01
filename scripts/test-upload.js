const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:4000'; // Adjust if needed
const TEST_FILE_PATH = path.join(__dirname, 'test-image.jpg');

async function runTests() {
    console.log('🚀 Starting Post-Migration Upload Tests...');

    // Create a dummy test file
    fs.writeFileSync(TEST_FILE_PATH, 'dummy content');

    try {
        // Test 1: Upload Valid File
        console.log('\n1️⃣ Testing Valid Upload...');

        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const fileContent = fs.readFileSync(TEST_FILE_PATH);

        const body = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test-image.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
            fileContent,
            Buffer.from(`\r\n--${boundary}--\r\n`),
        ]);

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body: body,
        });

        if (res.status === 201) {
            const data = await res.json();
            if (data.url && data.url.includes('supabase.co')) {
                console.log('✅ Upload Success:', data.url);

                // Verify URL accessibility
                console.log('   Verifying URL accessibility...');
                const urlRes = await fetch(data.url);
                if (urlRes.status === 200) {
                    console.log('   ✅ File is accessible!');
                } else {
                    console.error('   ❌ File URL not accessible:', urlRes.status);
                }
            } else {
                console.error('❌ Invalid Response Data:', data);
            }
        } else {
            const text = await res.text();
            console.error('❌ Upload Failed:', res.status, text);
        }

        // Test 2: Invalid MIME Type
        console.log('\n2️⃣ Testing Invalid MIME Type (.exe)...');

        const exeContent = Buffer.from('exe content');
        const exeBody = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="malware.exe"\r\nContent-Type: application/x-msdownload\r\n\r\n`),
            exeContent,
            Buffer.from(`\r\n--${boundary}--\r\n`),
        ]);

        const exeRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body: exeBody,
        });

        if (exeRes.status === 400) {
            console.log('✅ Correctly rejected invalid MIME type');
        } else {
            console.error('❌ Failed: Should have rejected .exe. Status:', exeRes.status);
        }

    } catch (error) {
        console.error('❌ Test Suite Failed:', error);
    } finally {
        // Cleanup
        if (fs.existsSync(TEST_FILE_PATH)) {
            fs.unlinkSync(TEST_FILE_PATH);
        }
        console.log('\n🏁 Tests Completed');
    }
}

runTests();
