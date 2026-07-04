import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Pastikan sudah install bcryptjs

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@paket.com' },
    update: {},
    create: {
      name: 'Admin Utama',
      email: 'admin@paket.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  
  console.log('✅ Admin berhasil dibuat: admin@paket.com | Password: admin123');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());