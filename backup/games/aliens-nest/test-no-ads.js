/**
 * Test script to verify ads have been removed
 */

const http = require('http');

function testNoAds() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('\n=== Reklam Kontrolü ===\n');
                
                // Check for ad-related scripts
                const hasAdSense = data.includes('adSense.js');
                const hasPokiSDK = data.includes('patch/poki-sdk.js');
                const hasOldLoader = data.includes('scripts/poki-unity-loader.js');
                const hasNewLoader = data.includes('scripts/poki-unity-loader-no-ads.js');
                
                if (!hasAdSense) {
                    console.log('✓ AdSense scripti kaldırıldı');
                } else {
                    console.log('✗ AdSense scripti hala mevcut');
                }
                
                if (!hasPokiSDK) {
                    console.log('✓ Poki SDK kaldırıldı');
                } else {
                    console.log('✗ Poki SDK hala mevcut');
                }
                
                if (!hasOldLoader) {
                    console.log('✓ Eski Poki loader kaldırıldı');
                } else {
                    console.log('✗ Eski Poki loader hala mevcut');
                }
                
                if (hasNewLoader) {
                    console.log('✓ Yeni reklamsız loader eklendi');
                } else {
                    console.log('✗ Yeni reklamsız loader bulunamadı');
                }
                
                // Check for essential game elements
                const hasGameContainer = data.includes('id="game-container"');
                const hasSlideshow = data.includes('id="slideshow"');
                const hasUnityConfig = data.includes('window.config');
                
                console.log('\n=== Oyun Elementleri ===\n');
                
                if (hasGameContainer && hasSlideshow && hasUnityConfig) {
                    console.log('✓ Tüm oyun elementleri mevcut');
                    console.log('  - Game container: ✓');
                    console.log('  - Slideshow: ✓');
                    console.log('  - Unity config: ✓');
                } else {
                    console.log('✗ Bazı oyun elementleri eksik');
                }
                
                console.log('\n=== Sonuç ===\n');
                if (!hasAdSense && !hasPokiSDK && !hasOldLoader && hasNewLoader) {
                    console.log('✓ Reklamlar başarıyla kaldırıldı!');
                    console.log('\nTarayıcınızda test etmek için: http://localhost:8000');
                } else {
                    console.log('✗ Bazı reklam scriptleri hala mevcut');
                }
                
                console.log('\n');
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log('✗ Sunucuya bağlanılamadı');
            console.log(`  Hata: ${e.message}`);
            reject(e);
        });

        req.end();
    });
}

testNoAds().catch(err => {
    console.error('Test başarısız:', err.message);
    process.exit(1);
});
