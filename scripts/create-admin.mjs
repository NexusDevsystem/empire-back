import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://Nexus:Suasenha123@nexusteam.mayhjak.mongodb.net/EmpireTrajesFinos';

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    full_name: String,
    created_at: { type: Date, default: Date.now }
});

const ProfileSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    role: String,
    created_at: { type: Date, default: Date.now }
});

async function createAdmin() {
    console.log('🚀 Criando usuário admin...\n');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado ao MongoDB\n');

        const User = mongoose.model('User', UserSchema);
        const Profile = mongoose.model('Profile', ProfileSchema);

        // Verificar se já existe
        const existing = await User.findOne({ email: 'empire@admin.com' });
        if (existing) {
            console.log('⚠️  Usuário empire@admin.com já existe!');
            console.log('   Deletando para recriar...\n');
            await Profile.deleteOne({ user_id: existing._id });
            await User.deleteOne({ _id: existing._id });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash('emperi@23', 10);

        // Criar usuário
        const user = await User.create({
            email: 'empire@admin.com',
            password: hashedPassword,
            full_name: 'Empire Admin'
        });

        console.log('✅ Usuário criado:');
        console.log('   Email: empire@admin.com');
        console.log('   Senha: emperi@23');
        console.log('   ID:', user._id.toString());

        // Criar perfil admin
        await Profile.create({
            user_id: user._id,
            role: 'admin'
        });

        console.log('   Role: admin\n');
        console.log('🎉 Pronto! Você pode fazer login agora.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro:', error);
        process.exit(1);
    }
}

createAdmin();
