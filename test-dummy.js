const http = require('http');

http.get('http://archers-blog-api-fetcher-not-needed.test', () => {}).on('error', () => {});
// Wait, I can just use Next.js dev server.
