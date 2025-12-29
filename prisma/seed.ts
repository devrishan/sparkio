// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const Role = { USER: 'USER', ADMIN: 'ADMIN' } as const;
const Rank = { NEWBIE: 'NEWBIE' } as const;

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminReferralCode = 'ADMIN001';

  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      email: 'admin@earniq.app',
      username: 'admin',
      role: Role.ADMIN,
      referralCode: adminReferralCode,
      wallet: {
        create: {
          balance: 0,
          pendingAmount: 0,
          withdrawable: 0,
          lockedAmount: 0,
          coins: 0,
          totalEarned: 0,
          currency: 'INR',
        },
      },
      gamification: {
        create: {
          xp: 0,
          rank: Rank.NEWBIE,
          streakDays: 0,
        },
      },
      preferences: {
        create: {
          language: 'en',
          timezone: 'Asia/Kolkata',
          theme: 'light',
        },
      },
    },
  });

  console.log('✅ Admin user created:', admin.id);

  // Create sample task categories
  const categories = [
    { name: 'Shopping', slug: 'shopping' },
    { name: 'Food & Dining', slug: 'food-dining' },
    { name: 'Entertainment', slug: 'entertainment' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Health & Fitness', slug: 'health-fitness' },
  ];

  for (const category of categories) {
    await prisma.taskCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Task categories created');

  // Create sample tasks
  const shoppingCategory = await prisma.taskCategory.findUnique({
    where: { slug: 'shopping' },
  });

  if (shoppingCategory) {
    await prisma.task.upsert({
      where: { slug: 'buy-product-amazon' },
      update: {},
      create: {
        title: 'Buy a product from Amazon',
        slug: 'buy-product-amazon',
        description: 'Purchase any product from Amazon and upload the order confirmation screenshot.',
        categoryId: shoppingCategory.id,
        rewardAmount: 50.0,
        rewardCoins: 100,
        difficulty: 'Easy',
        isActive: true,
        maxSubmissions: 1,
      },
    });

    await prisma.task.upsert({
      where: { slug: 'buy-product-flipkart' },
      update: {},
      create: {
        title: 'Buy a product from Flipkart',
        slug: 'buy-product-flipkart',
        description: 'Purchase any product from Flipkart and upload the order confirmation screenshot.',
        categoryId: shoppingCategory.id,
        rewardAmount: 50.0,
        rewardCoins: 100,
        difficulty: 'Easy',
        isActive: true,
        maxSubmissions: 1,
      },
    });
  }

  console.log('✅ Sample tasks created');

  // Create sample badges
  const badges = [
    {
      code: 'FIRST_TASK',
      name: 'First Task',
      description: 'Complete your first task',
      icon: '🎯',
    },
    {
      code: 'TEN_TASKS',
      name: 'Task Master',
      description: 'Complete 10 tasks',
      icon: '⭐',
    },
    {
      code: 'FIRST_REFERRAL',
      name: 'Referral Starter',
      description: 'Refer your first friend',
      icon: '👥',
    },
    {
      code: 'LEVEL_PRO',
      name: 'Pro Rank',
      description: 'Reach Pro rank',
      icon: '🏆',
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge,
    });
  }

  console.log('✅ Badges created');

  // Create sample users (for testing)
  const testUsers = [
    {
      phone: '9876543210',
      email: 'user1@test.com',
      username: 'testuser1',
      referralCode: 'TEST001',
    },
    {
      phone: '9876543211',
      email: 'user2@test.com',
      username: 'testuser2',
      referralCode: 'TEST002',
      referredBy: 'TEST001', // Referred by user1
    },
  ];

  for (const userData of testUsers) {
    const referrer = userData.referredBy
      ? await prisma.user.findUnique({
          where: { referralCode: userData.referredBy },
        })
      : null;

    await prisma.user.upsert({
      where: { phone: userData.phone },
      update: {},
      create: {
        phone: userData.phone,
        email: userData.email,
        username: userData.username,
        role: Role.USER,
        referralCode: userData.referralCode,
        referredById: referrer?.id,
        wallet: {
          create: {
            balance: 0,
            pendingAmount: 0,
            withdrawable: 0,
            lockedAmount: 0,
            coins: 0,
            totalEarned: 0,
            currency: 'INR',
          },
        },
        gamification: {
          create: {
            xp: 0,
            rank: Rank.NEWBIE,
            streakDays: 0,
          },
        },
        preferences: {
          create: {
            language: 'en',
            timezone: 'Asia/Kolkata',
            theme: 'light',
          },
        },
      },
    });
  }

  console.log('✅ Test users created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
