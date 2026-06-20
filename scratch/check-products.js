const { neon } = require('@neondatabase/serverless');

const connectionString = "postgresql://neondb_owner:npg_mlM2jECvJay9@ep-dark-meadow-attftpyf-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(connectionString);

async function run() {
  try {
    const products = await sql`select * from products`;
    console.log("All products in database:");
    console.log(products);
  } catch (err) {
    console.error("Error executing query:", err);
  }
}

run();
