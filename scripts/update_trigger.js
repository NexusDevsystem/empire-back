import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Reusing the connection string
const connectionString = 'postgresql://postgres:empiretrajesfinos@db.vjvaktafnnjcfouexeut.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function migrate() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected.');

        const sqlPath = path.join(__dirname, '../supabase/update_trigger.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Updating handle_new_user function...');
        await client.query(sql);
        console.log('Update successful!');
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
