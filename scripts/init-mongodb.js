const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://Nexus:Suasenha123@nexusteam.mayhjak.mongodb.net/EmpireTrajesFinos';

async function initializeDatabase() {
    console.log('🚀 Inicializando MongoDB...\n');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado ao MongoDB\n');

        // Lista de collections que devem existir
        const collections = [
            'users',
            'profiles',
            'items',
            'clients',
            'contracts',
            'appointments',
            'transactions',
            'employees',
            'notifications',
            'settings'
        ];

        console.log('📦 Criando collections...\n');

        const existingCollections = await mongoose.connection.db.listCollections().toArray();
        const existingNames = existingCollections.map(c => c.name);

        for (const collectionName of collections) {
            if (existingNames.includes(collectionName)) {
                console.log(`  ✅ ${collectionName} - já existe`);
            } else {
                await mongoose.connection.db.createCollection(collectionName);
                console.log(`  ✨ ${collectionName} - criada`);
            }
        }

        console.log('\n✅ Banco de dados inicializado com sucesso!');
        console.log('\n📊 Collections disponíveis:');
        collections.forEach(c => console.log(`   - ${c}`));

        await mongoose.disconnect();
        console.log('\n👋 Desconectado');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro ao inicializar:', error);
        process.exit(1);
    }
}

initializeDatabase();
