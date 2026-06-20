const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

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
    const users = await sql`SELECT * FROM "user"`;
    console.log("Registered Users count:", users.length);
    console.log("Users:", users);

    const accounts = await sql`SELECT * FROM "account"`;
    console.log("Accounts count:", accounts.length);
    console.log("Accounts:", accounts);
  } catch (err) {
    console.error("Error querying database:", err);
  }
}

main();
