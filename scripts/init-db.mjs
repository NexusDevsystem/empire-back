import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://Nexus:Suasenha123@nexusteam.mayhjak.mongodb.net/EmpireTrajesFinos';

async function init() {
    console.log('🚀 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado!\n');

    const collections = [
        'users', 'profiles', 'items', 'clients', 'contracts',
        'appointments', 'transactions', 'employees', 'notifications', 'settings'
    ];

    console.log('📦 Criando collections...\n');

    for (const name of collections) {
        try {
            await mongoose.connection.db.createCollection(name);
            console.log(`  ✨ ${name} - criada`);
        } catch (e) {
            console.log(`  ✅ ${name} - já existe`);
        }
    }

    console.log('\n✅ Pronto!');
    await mongoose.disconnect();
    process.exit(0);
}

init().catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
});
