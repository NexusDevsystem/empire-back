import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = 'postgresql://postgres:empiretrajesfinos@db.vjvaktafnnjcfouexeut.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function migrate() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected successfully.');

        const sqlPath = path.join(__dirname, '../supabase/schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing schema SQL...');
        await client.query(sql);
        console.log('Schema created successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
