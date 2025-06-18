import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';

config();

// Get the backend URL from environment variable
const backendUrl = process.env.VITE_BASE_URL;

if (!backendUrl) {
  console.error('Error: BACKEND_URL environment variable is not set');
  process.exit(1);
}

console.log(`Backend URL: ${backendUrl}`);
// Create the redirects content
const redirectsContent = `
/api/* ${backendUrl}/:splat 200
/* /index.html 200
`.trim();

// Write the _redirects file to the public directory
const redirectsPath = join(process.cwd(), 'public', '_redirects');

try {
  writeFileSync(redirectsPath, redirectsContent, 'utf8');
  console.log(` _redirects file created successfully at ${redirectsPath}`);
  console.log(` Backend URL: ${backendUrl}`);
} catch (error) {
  console.error('Error writing _redirects file:', error);
  process.exit(1);
}
