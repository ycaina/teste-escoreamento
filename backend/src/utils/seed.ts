import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Verificar se já existe admin
    const existingAdmin = await User.findOne({ email: 'admin@escoramento.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin já existe');
      process.exit(0);
    }

    // Criar usuário admin
    await User.create({
      email: 'admin@escoramento.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'admin'
    });

    console.log('✅ Usuário admin criado com sucesso');
    console.log('📧 Email: admin@escoramento.com');
    console.log('🔑 Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
};

seedAdmin();
