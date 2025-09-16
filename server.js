#!/usr/bin/env node
// FemuBot Simple HTTP Server
// Developer Credits: HORACE KALENGA & FEMU EDUCATIONAL SUCCESS

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Get MIME type based on file extension
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Construct file path
    const filePath = path.join(__dirname, pathname);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('Forbidden');
        return;
    }
    
    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - File Not Found</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            background: white; 
                            padding: 2rem; 
                            border-radius: 10px; 
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 { color: #2d7a3c; }
                        .logo { font-size: 3rem; margin-bottom: 1rem; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">🤖</div>
                        <h1>404 - File Not Found</h1>
                        <p><strong>FemuBot Server</strong></p>
                        <p>The requested file <code>${pathname}</code> was not found.</p>
                        <p><a href="/" style="color: #2d7a3c;">← Back to FemuBot</a></p>
                        <hr style="margin: 2rem 0; border: 1px solid #e8f5e8;">
                        <small style="color: #666;">
                            <strong>Developed by:</strong> HORACE KALENGA & FEMU EDUCATIONAL SUCCESS
                        </small>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
                return;
            }
            
            const mimeType = getMimeType(filePath);
            res.writeHead(200, {'Content-Type': mimeType});
            res.end(data);
            
            // Log the request
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode}`);
        });
    });
});

// Start server
server.listen(PORT, () => {
    console.log('🤖 FemuBot Server Started!');
    console.log('=====================================');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('🎓 Developer Credits: HORACE KALENGA & FEMU EDUCATIONAL SUCCESS');
    console.log('=====================================');
    console.log('📊 Access FemuBot:');
    console.log(`   Student Portal: http://localhost:${PORT}/`);
    console.log(`   Admin Panel:    http://localhost:${PORT}/admin.html`);
    console.log('=====================================');
    console.log('⚡ CORS enabled - JSON files will load properly');
    console.log('🛑 Press Ctrl+C to stop the server');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down FemuBot server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try:`);
        console.error(`   1. Stop other servers running on port ${PORT}`);
        console.error(`   2. Or change the PORT variable in server.js`);
    } else {
        console.error('❌ Server error:', err);
    }
    process.exit(1);
});