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

async function applyPolicies() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected.');

        const sqlPath = path.join(__dirname, '../supabase/policies.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying RLS policies...');
        await client.query(sql);
        console.log('Policies applied successfully!');
    } catch (err) {
        console.error('Failed to apply policies:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyPolicies();
