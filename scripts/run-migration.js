#!/usr/bin/env node

const http = require('http');

// Wait for server to be ready
setTimeout(() => {
    const makeRequest = (method = 'GET') => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/migrations/categories',
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log(`\n${method} Response:`, JSON.stringify(json, null, 2));
                    
                    if (method === 'GET' && json.productsNeedingMigration > 0) {
                        console.log('\n\nRunning migration...\n');
                        setTimeout(() => makeRequest('POST'), 500);
                    } else if (method === 'POST') {
                        process.exit(0);
                    }
                } catch (e) {
                    console.error('Failed to parse response:', data);
                    console.error('Error:', e.message);
                    process.exit(1);
                }
            });
        });

        req.on('error', (e) => {
            console.error('Request error:', e.message);
            console.error('Make sure the dev server is running on http://localhost:3000');
            process.exit(1);
        });

        req.end();
    };

    console.log('Checking migration status...');
    makeRequest('GET');
}, 1000);
