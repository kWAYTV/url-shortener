/* eslint-disable no-console */
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';

import { db } from '@/lib/db';
import { urls, user } from '@/schemas/db.schema';

/**
 * Seed the database with test data
 */
export async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create test users
    const testUsers = [
      {
        id: randomUUID(),
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: false,
        image: null,
        role: 'user' as const,
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Demo User',
        email: 'demo@example.com',
        emailVerified: false,
        image: null,
        role: 'user' as const,
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: 'Admin User',
        email: 'admin@example.com',
        emailVerified: true,
        image: null,
        role: 'admin' as const,
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('👤 Creating test users...');

    // Insert users one by one to handle potential duplicates
    for (const userData of testUsers) {
      try {
        await db.insert(user).values(userData).onConflictDoNothing();
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error);
      }
    }

    // Get the inserted users to use their IDs
    const insertedUsers = await db.query.user.findMany({
      where: (user, { eq, or }) =>
        or(
          eq(user.email, 'test@example.com'),
          eq(user.email, 'demo@example.com'),
          eq(user.email, 'admin@example.com')
        )
    });

    if (insertedUsers.length === 0) {
      throw new Error('Failed to retrieve inserted users');
    }

    // Create test URLs
    const testUrls = [
      // URLs for the first user
      {
        originalUrl: 'https://github.com',
        shortCode: 'github',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        clicks: 42,
        userId: insertedUsers[0].id
      },
      {
        originalUrl: 'https://nextjs.org',
        shortCode: 'nextjs',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        clicks: 27,
        userId: insertedUsers[0].id
      },
      {
        originalUrl: 'https://tailwindcss.com',
        shortCode: 'tailwind',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        clicks: 15,
        userId: insertedUsers[0].id
      },

      // URLs for the second user
      {
        originalUrl: 'https://react.dev',
        shortCode: 'react',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        clicks: 31,
        userId: insertedUsers[1].id
      },
      {
        originalUrl: 'https://typescriptlang.org',
        shortCode: 'typescript',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        clicks: 19,
        userId: insertedUsers[1].id
      },

      // URLs without a user (anonymous)
      {
        originalUrl: 'https://example.com',
        shortCode: 'example',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        clicks: 8,
        userId: null
      },
      {
        originalUrl: 'https://google.com',
        shortCode: 'google',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        clicks: 53,
        userId: null
      }
    ];

    console.log('🔗 Creating test URLs...');

    // Insert URLs one by one to handle potential duplicates
    for (const url of testUrls) {
      try {
        await db.insert(urls).values(url).onConflictDoNothing();
        console.log(`✅ Created URL: ${url.shortCode} -> ${url.originalUrl}`);
      } catch (error) {
        console.error(`❌ Error creating URL ${url.shortCode}:`, error);
      }
    }

    // Generate some random URLs with random short codes
    console.log('🎲 Creating random URLs...');

    for (let i = 0; i < 10; i++) {
      const randomUrl = {
        originalUrl: `https://random-site-${i + 1}.com`,
        shortCode: nanoid(6),
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        ),
        updatedAt: new Date(
          Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        ),
        clicks: Math.floor(Math.random() * 100),
        userId:
          Math.random() > 0.5
            ? insertedUsers[Math.floor(Math.random() * insertedUsers.length)].id
            : null
      };

      try {
        await db.insert(urls).values(randomUrl);
        console.log(
          `✅ Created random URL: ${randomUrl.shortCode} -> ${randomUrl.originalUrl}`
        );
      } catch (error) {
        console.error(`❌ Error creating random URL:`, error);
      }
    }

    console.log('✅ Seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error };
  }
}
