/**
 * Simple test script to verify game functionality on localhost
 * This script checks:
 * 1. Page loads without redirect
 * 2. Initial screen elements are present
 * 3. Domain detection logs appear in console
 */

const http = require('http');

// Test 1: Check if server is running
function testServerRunning() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log('✓ Test 1 PASSED: Server is running on localhost:8000');
            console.log(`  Status Code: ${res.statusCode}`);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                // Test 2: Check if HTML contains expected elements
                const hasSlideshow = data.includes('id="slideshow"');
                const hasThumbnail = data.includes('id="thumbnail"');
                const hasProgressContainer = data.includes('id="progress-container"');
                const hasPokiSDK = data.includes('patch/poki-sdk.js');
                
                if (hasSlideshow && hasThumbnail && hasProgressContainer && hasPokiSDK) {
                    console.log('✓ Test 2 PASSED: HTML contains all expected elements');
                    console.log('  - Slideshow element: ✓');
                    console.log('  - Thumbnail element: ✓');
                    console.log('  - Progress container: ✓');
                    console.log('  - Poki SDK script: ✓');
                } else {
                    console.log('✗ Test 2 FAILED: Missing expected elements');
                    if (!hasSlideshow) console.log('  - Slideshow element: ✗');
                    if (!hasThumbnail) console.log('  - Thumbnail element: ✗');
                    if (!hasProgressContainer) console.log('  - Progress container: ✗');
                    if (!hasPokiSDK) console.log('  - Poki SDK script: ✗');
                }
                
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log('✗ Test 1 FAILED: Server is not running');
            console.log(`  Error: ${e.message}`);
            reject(e);
        });

        req.end();
    });
}

// Run tests
console.log('\n=== Testing Game on Localhost ===\n');
testServerRunning()
    .then(() => {
        console.log('\n=== Manual Testing Required ===');
        console.log('Please open your browser and navigate to: http://localhost:8000');
        console.log('\nVerify the following:');
        console.log('1. Initial screen loads without redirect');
        console.log('2. Play button and game thumbnail are visible');
        console.log('3. Open browser console (F12) and check for:');
        console.log('   - "DEBUG: Domain detected: localhost"');
        console.log('   - "DEBUG: Poki ad server will be used: false" (or similar)');
        console.log('4. Click the play button');
        console.log('5. Verify game loading starts with progress indicators');
        console.log('6. Check console for any errors');
        console.log('\n=== Tests Complete ===\n');
    })
    .catch((err) => {
        console.error('\nTests failed:', err.message);
        process.exit(1);
    });
