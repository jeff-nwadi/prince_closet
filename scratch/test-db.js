const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error parsing .env file:", e);
}


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  try {
    const res = await sql`SELECT NOW()`;
    console.log("Database connection successful. Current time:", res[0].now);
    
    // Check if we can query tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Existing tables in public schema:");
    tables.forEach(t => console.log("- " + t.table_name));
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}

main();
