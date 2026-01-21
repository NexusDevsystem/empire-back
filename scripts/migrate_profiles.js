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
        console.log('Connected.');

        const sqlPath = path.join(__dirname, '../supabase/profiles.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Creating profiles table and triggers...');
        await client.query(sql);
        console.log('Migration successful!');
    } catch (err) {
        if (err.message.includes('already exists')) {
            console.log('Table likely already exists, skipping or partial success.');
        } else {
            console.error('Migration failed:', err);
        }
    } finally {
        await client.end();
    }
}

migrate();
