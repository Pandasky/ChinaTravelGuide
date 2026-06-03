import { PrismaClient, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@chinawise.com' },
    update: {},
    create: {
      email: 'admin@chinawise.com',
      password: adminPassword,
      name: 'Admin User',
      isAdmin: true,
      isActive: true,
    },
  });
  console.log('👤 Admin user created: admin@chinawise.com / admin123');

  // Seed categories
  const categories = [
    // Cities
    { name: 'Beijing', slug: 'beijing', type: CategoryType.CITY },
    { name: 'Shanghai', slug: 'shanghai', type: CategoryType.CITY },
    { name: 'Xi\'an', slug: 'xian', type: CategoryType.CITY },
    { name: 'Guilin', slug: 'guilin', type: CategoryType.CITY },
    { name: 'Chengdu', slug: 'chengdu', type: CategoryType.CITY },
    { name: 'Hangzhou', slug: 'hangzhou', type: CategoryType.CITY },
    { name: 'Suzhou', slug: 'suzhou', type: CategoryType.CITY },
    { name: 'Hong Kong', slug: 'hong-kong', type: CategoryType.CITY },

    // Themes
    { name: 'Food & Dining', slug: 'food-dining', type: CategoryType.THEME },
    { name: 'History & Culture', slug: 'history-culture', type: CategoryType.THEME },
    { name: 'Nature & Scenery', slug: 'nature-scenery', type: CategoryType.THEME },
    { name: 'Adventure', slug: 'adventure', type: CategoryType.THEME },
    { name: 'Shopping', slug: 'shopping', type: CategoryType.THEME },
    { name: 'Nightlife', slug: 'nightlife', type: CategoryType.THEME },

    // Durations
    { name: '1 Day', slug: '1-day', type: CategoryType.DURATION },
    { name: '2-3 Days', slug: '2-3-days', type: CategoryType.DURATION },
    { name: '4-5 Days', slug: '4-5-days', type: CategoryType.DURATION },
    { name: '1 Week+', slug: '1-week-plus', type: CategoryType.DURATION },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Seed FAQs
  const faqs = [
    {
      question: 'How do I access my purchased guides?',
      answer: 'After purchase, you can access all your guides in the "My Guides" section of your user dashboard. You can download them as many times as you need.',
      order: 1,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, Mastercard, American Express) through Stripe, as well as PayPal. All payments are processed securely.',
      order: 2,
    },
    {
      question: 'Can I get a refund for a guide?',
      answer: 'Due to the digital nature of our guides, we generally do not offer refunds. However, if you experience technical issues, please contact our support team.',
      order: 3,
    },
    {
      question: 'How does the AI assistant work?',
      answer: 'Our AI assistant uses advanced language models to provide personalized travel advice. Subscribe to a plan (Daily, Weekly, or Monthly) to get unlimited access.',
      order: 4,
    },
    {
      question: 'Are the guides available offline?',
      answer: 'Yes! Once you download a PDF guide, you can access it offline on any device. Perfect for travelers without constant internet access.',
      order: 5,
    },
    {
      question: 'How often are guides updated?',
      answer: 'We update our guides regularly to ensure accuracy. Major updates are released quarterly, with minor updates as needed for things like price changes or new attractions.',
      order: 6,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: faq.order.toString() },
      update: {},
      create: faq,
    });
  }

  // Seed testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      country: 'United States',
      content: 'ChinaWise made my first trip to China so much easier! The Beijing guide was incredibly detailed and the AI assistant helped me navigate the subway system like a pro.',
      rating: 5,
      order: 1,
    },
    {
      name: 'Michael Chen',
      country: 'Canada',
      content: 'I\'ve been to China multiple times, but these guides showed me hidden gems I never knew existed. The food recommendations in Chengdu were spot-on!',
      rating: 5,
      order: 2,
    },
    {
      name: 'Emma Thompson',
      country: 'United Kingdom',
      content: 'The AI assistant was a lifesaver when I needed emergency phrases. Worth every penny for the subscription. Highly recommend!',
      rating: 5,
      order: 3,
    },
    {
      name: 'David Martinez',
      country: 'Spain',
      content: 'Great value for money. The PDF guides are well-designed and easy to read on mobile. Customer support was also very helpful.',
      rating: 4,
      order: 4,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  // Seed sample guides
  const beijingCategory = await prisma.category.findUnique({ where: { slug: 'beijing' } });
  const shanghaiCategory = await prisma.category.findUnique({ where: { slug: 'shanghai' } });
  const xianCategory = await prisma.category.findUnique({ where: { slug: 'xian' } });
  const foodCategory = await prisma.category.findUnique({ where: { slug: 'food-dining' } });
  const historyCategory = await prisma.category.findUnique({ where: { slug: 'history-culture' } });
  const natureCategory = await prisma.category.findUnique({ where: { slug: 'nature-scenery' } });
  const dayTripCategory = await prisma.category.findUnique({ where: { slug: '1-day' } });

  const guides = [
    {
      title: 'Beijing Ultimate Guide',
      subtitle: 'The Complete Travel Guide to China\'s Capital',
      description: 'Discover the best of Beijing with our comprehensive guide. From the Great Wall to hidden hutongs, experience the perfect blend of ancient history and modern culture. Includes detailed maps, restaurant recommendations, and insider tips.',
      coverImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
      pdfUrl: 'https://example.com/guides/beijing-ultimate.pdf',
      price: '9.99',
      isFree: false,
      isPublished: true,
      pageCount: 45,
      categories: [beijingCategory?.id, historyCategory?.id].filter(Boolean) as string[],
    },
    {
      title: 'Shanghai Food Guide',
      subtitle: 'Authentic Local Eats and Fine Dining',
      description: 'Navigate Shanghai\'s incredible food scene with our curated guide. From street food stalls to Michelin-starred restaurants, discover flavors that will make your trip unforgettable.',
      coverImage: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800',
      pdfUrl: 'https://example.com/guides/shanghai-food.pdf',
      price: '7.99',
      isFree: false,
      isPublished: true,
      pageCount: 32,
      categories: [shanghaiCategory?.id, foodCategory?.id].filter(Boolean) as string[],
    },
    {
      title: 'Xi\'an Terracotta Warriors Day Trip',
      subtitle: 'Your Complete Guide to the Ancient Warriors',
      description: 'Plan the perfect day trip to see the world-famous Terracotta Warriors. Includes transportation options, best viewing times, and nearby attractions to maximize your visit.',
      coverImage: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800',
      pdfUrl: 'https://example.com/guides/xian-warriors.pdf',
      price: '4.99',
      isFree: false,
      isPublished: true,
      pageCount: 18,
      categories: [xianCategory?.id, historyCategory?.id, dayTripCategory?.id].filter(Boolean) as string[],
    },
    {
      title: 'Free Beijing Subway Guide',
      subtitle: 'Navigate Beijing Like a Local',
      description: 'Master the Beijing subway system with this free guide. Includes line maps, station names in English and Chinese, ticket purchasing tips, and etiquette guidelines.',
      coverImage: 'https://images.unsplash.com/photo-1538439907460-1596cafd4eff?w=800',
      pdfUrl: 'https://example.com/guides/beijing-subway.pdf',
      price: '0.00',
      isFree: true,
      isPublished: true,
      pageCount: 12,
      categories: [beijingCategory?.id].filter(Boolean) as string[],
    },
  ];

  for (const guideData of guides) {
    const { categories: catIds, ...guide } = guideData;
    await prisma.guide.create({
      data: {
        ...guide,
        categories: {
          connect: catIds.map(id => ({ id })),
        },
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
