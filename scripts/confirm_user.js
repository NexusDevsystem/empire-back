
import pg from 'pg';

// Actually, let's reuse the robust method from create_admin.js or migrate_db.js.
// migrate_db.js uses the hardcoded connection string. Let's stick to that for reliability as I saw it in the file view previously.

const { Client } = pg;

const connectionString = 'postgresql://postgres:empiretrajesfinos@db.vjvaktafnnjcfouexeut.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function confirmUser() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected.');

        const email = 'empire@admin.com';
        console.log(`Confirming email for: ${email}`);

        const res = await client.query(
            `UPDATE auth.users SET email_confirmed_at = now() WHERE email = $1 RETURNING id`,
            [email]
        );

        if (res.rowCount > 0) {
            console.log(`Success! User confirmed. ID: ${res.rows[0].id}`);
        } else {
            console.log('User not found.');
        }

    } catch (err) {
        console.error('Operation failed:', err);
    } finally {
        await client.end();
    }
}

confirmUser();
