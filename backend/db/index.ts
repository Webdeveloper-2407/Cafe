import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from '../config/constants.js';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  featured: boolean;
  ingredients?: string[];
  allergens?: string[];
  preparationTime?: string;
  calories?: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // CAF-2026-XXXX
  customerName: string;
  email: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  notes?: string;
  estimatedTime?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  published: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  published: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  orderCounter: number;
  users: User[];
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  reservations: Reservation[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  blogPosts: BlogPost[];
  galleryImages: GalleryImage[];
}

export function hashPassword(password: string): string {
  const salt = 'cafe_artisan_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export function getInitialCategories(): Category[] {
  return [
    { id: 'cat_coffee', name: 'Coffee & Espresso', slug: 'coffee', description: 'Freshly roasted single-origin coffees and classic espresso extractions', displayOrder: 1 },
    { id: 'cat_cold', name: 'Cold Coffee', slug: 'cold-coffee', description: 'Slow-steeped cold brews, iced lattes, and specialty chilled espresso', displayOrder: 2 },
    { id: 'cat_tea', name: 'Tea & Other Drinks', slug: 'tea-drinks', description: 'Artisanal loose-leaf teas, organic matcha, and soothing hot chocolates', displayOrder: 3 },
    { id: 'cat_breakfast', name: 'Breakfast', slug: 'breakfast', description: 'Freshly baked flaky pastries, sourdough toasts, and hearty morning plates', displayOrder: 4 },
    { id: 'cat_desserts', name: 'Desserts & Pastries', slug: 'desserts', description: 'Handcrafted cakes, rich cheesecakes, and golden morning bakery', displayOrder: 5 },
    { id: 'cat_sandwiches', name: 'Sandwiches & Light Meals', slug: 'sandwiches', description: 'Toasted gourmet paninis, artisan deli subs, and fresh crisp salads', displayOrder: 6 },
  ];
}

export function getInitialMenuItems(): MenuItem[] {
  return [
    // 1. COFFEE & ESPRESSO
    {
      id: 'item_cappuccino',
      name: 'Cappuccino',
      slug: 'cappuccino',
      description: 'Rich espresso balanced with velvety steamed milk foam and delicate rosetta latte art.',
      fullDescription: 'Our signature cappuccino combines a double shot of freshly ground high-altitude espresso with precisely steamed whole milk microfoam. Poured to create a rich, silky texture with notes of cocoa and toasted hazelnut.',
      price: 3.50,
      image: '/images/coffee.jpg',
      category: 'Coffee & Espresso',
      available: true,
      featured: true,
      ingredients: ['Double espresso shot', 'Steamed whole milk microfoam'],
      allergens: ['Dairy (Oat/Almond alternatives available)'],
      preparationTime: '3-4 mins',
      calories: 120,
      tags: ['Classic', 'Espresso', 'Popular', 'Signature'],
      createdAt: '2026-03-01T08:00:00Z',
    },
    {
      id: 'item_espresso',
      name: 'Espresso',
      slug: 'espresso',
      description: 'Intense single shot extraction of our seasonal single-origin Ethiopian beans with thick golden crema.',
      fullDescription: 'A pure, concentrated 30ml extraction showcasing bright floral aromatics, balanced citrus acidity, and a smooth molasses finish.',
      price: 2.75,
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['100% Arabica washed Ethiopian beans'],
      allergens: ['None'],
      preparationTime: '2 mins',
      calories: 5,
      tags: ['Espresso', 'Pure'],
      createdAt: '2026-03-01T08:02:00Z',
    },
    {
      id: 'item_double_espresso',
      name: 'Double Espresso (Doppio)',
      slug: 'double-espresso',
      description: 'Double shot extraction delivering concentrated richness, heavy crema, and complex undertones.',
      fullDescription: 'A full 60ml double extraction delivering rich depth and intense body with notes of dark baker’s chocolate and stone fruit.',
      price: 3.25,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Freshly ground espresso beans'],
      allergens: ['None'],
      preparationTime: '2 mins',
      calories: 10,
      tags: ['Espresso', 'Bold'],
      createdAt: '2026-03-01T08:03:00Z',
    },
    {
      id: 'item_americano',
      name: 'Caffè Americano',
      slug: 'caffe-americano',
      description: 'Bold double espresso diluted with hot filtered water for a clean, nuanced black coffee.',
      fullDescription: 'Double shot of house blend espresso layered over hot purified water at 92°C, preserving the delicate aromatics of the crema while providing a clean, extended cup.',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Double espresso', 'Hot purified water'],
      allergens: ['None'],
      preparationTime: '2-3 mins',
      calories: 10,
      tags: ['Classic', 'Black Coffee'],
      createdAt: '2026-03-01T08:04:00Z',
    },
    {
      id: 'item_latte',
      name: 'Caffè Latte',
      slug: 'caffe-latte',
      description: 'Smooth double espresso blended with generous velvety steamed milk and light microfoam.',
      fullDescription: 'Our traditional Caffè Latte is crafted with two shots of espresso and 8oz of gently steamed organic milk, creating a comforting, creamy sip with subtle sweetness.',
      price: 4.25,
      image: '/images/barista.jpg',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Double espresso', 'Steamed milk', 'Light foam'],
      allergens: ['Dairy'],
      preparationTime: '3 mins',
      calories: 170,
      tags: ['Smooth', 'Milky'],
      createdAt: '2026-03-01T08:05:00Z',
    },
    {
      id: 'item_vanilla_latte',
      name: 'Madagascar Vanilla Latte',
      slug: 'vanilla-latte',
      description: 'House-made organic Madagascar vanilla bean syrup infused with creamy steamed milk and espresso.',
      fullDescription: 'We infuse pure organic Madagascar vanilla pods directly into cane sugar syrup to flavor this silky latte, balancing the espresso roast with floral sweetness.',
      price: 4.75,
      image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Espresso', 'Steamed milk', 'Vanilla bean syrup'],
      allergens: ['Dairy'],
      preparationTime: '3-4 mins',
      calories: 220,
      tags: ['Sweet', 'Vanilla'],
      createdAt: '2026-03-01T08:06:00Z',
    },
    {
      id: 'item_caramel_latte',
      name: 'Salted Caramel Latte',
      slug: 'caramel-latte',
      description: 'Artisanal salted butter caramel drizzle layered into velvety espresso and hot microfoam milk.',
      fullDescription: 'Buttery caramel cooked slowly in copper pans, seasoned with French fleur de sel, and swirled through double espresso and rich steamed milk.',
      price: 4.75,
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Espresso', 'Steamed milk', 'House-made caramel', 'Sea salt'],
      allergens: ['Dairy'],
      preparationTime: '3-4 mins',
      calories: 240,
      tags: ['Sweet', 'Caramel'],
      createdAt: '2026-03-01T08:07:00Z',
    },
    {
      id: 'item_mocha',
      name: 'Caffè Mocha',
      slug: 'caffe-mocha',
      description: 'Belgian dark chocolate ganache melted into espresso, topped with silky steamed milk.',
      fullDescription: '70% Valrhona dark chocolate melted fresh with espresso shots, topped with steamed milk and a dusting of Dutch cocoa powder.',
      price: 4.95,
      image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Espresso', 'Valrhona dark chocolate', 'Steamed milk'],
      allergens: ['Dairy'],
      preparationTime: '4 mins',
      calories: 290,
      tags: ['Chocolate', 'Indulgent'],
      createdAt: '2026-03-01T08:08:00Z',
    },
    {
      id: 'item_flat_white',
      name: 'Flat White',
      slug: 'flat-white',
      description: 'Australian-style double ristretto topped with dense, velvety microfoam and zero dry bubbles.',
      fullDescription: 'Two short ristretto shots blended with silky microfoam poured with a glossy finish. Richer and punchier coffee-to-milk ratio than a traditional latte.',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Double ristretto', 'Velvety microfoam milk'],
      allergens: ['Dairy'],
      preparationTime: '3 mins',
      calories: 140,
      tags: ['Specialty', 'Barista Favorite'],
      createdAt: '2026-03-01T08:09:00Z',
    },
    {
      id: 'item_macchiato',
      name: 'Espresso Macchiato',
      slug: 'espresso-macchiato',
      description: 'Double shot of rich espresso "marked" with a dollop of warm milk froth.',
      fullDescription: 'Traditional Italian macchiato: intense espresso cut gently with a spoonful of textured milk froth to soften the initial sharpness.',
      price: 3.75,
      image: 'https://images.unsplash.com/photo-1534684686641-05569203ecca?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Double espresso', 'Dollop of milk froth'],
      allergens: ['Dairy'],
      preparationTime: '2 mins',
      calories: 25,
      tags: ['Traditional', 'Intense'],
      createdAt: '2026-03-01T08:10:00Z',
    },
    {
      id: 'item_cortado',
      name: 'Cortado',
      slug: 'cortado',
      description: 'Equal parts espresso and warm steamed milk served in a classic Gibraltar glass.',
      fullDescription: '1:1 ratio of double espresso and steamed milk, minimizing acidity while maintaining strong coffee punch and smooth texture.',
      price: 3.85,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      category: 'Coffee & Espresso',
      available: true,
      featured: false,
      ingredients: ['Double espresso (2oz)', 'Steamed milk (2oz)'],
      allergens: ['Dairy'],
      preparationTime: '2-3 mins',
      calories: 60,
      tags: ['Balanced', 'Gibraltar'],
      createdAt: '2026-03-01T08:11:00Z',
    },

    // 2. COLD COFFEE
    {
      id: 'item_iced_latte',
      name: 'Iced Latte',
      slug: 'iced-latte',
      description: 'Double shot of signature espresso poured over cold milk and crystal ice cubes.',
      fullDescription: 'Freshly pulled double espresso cooled and poured gently over chilled whole milk and artisanal clear ice cubes for a refreshing, revitalizing lift.',
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: true,
      ingredients: ['Double espresso', 'Chilled milk', 'Ice'],
      allergens: ['Dairy'],
      preparationTime: '2 mins',
      calories: 130,
      tags: ['Chilled', 'Refreshing', 'Popular'],
      createdAt: '2026-03-01T08:15:00Z',
    },
    {
      id: 'item_iced_americano',
      name: 'Iced Americano',
      slug: 'iced-americano',
      description: 'Crisp chilled espresso over ice and cold filtered water, clean and invigorating.',
      fullDescription: 'Two fresh shots of espresso poured over ice and purified water. Smooth, crisp, and thirst-quenching with vibrant coffee notes.',
      price: 3.75,
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: false,
      ingredients: ['Double espresso', 'Purified cold water', 'Ice'],
      allergens: ['None'],
      preparationTime: '2 mins',
      calories: 10,
      tags: ['Chilled', 'Zero Sugar'],
      createdAt: '2026-03-01T08:16:00Z',
    },
    {
      id: 'item_iced_mocha',
      name: 'Iced Caffè Mocha',
      slug: 'iced-mocha',
      description: 'Chilled espresso swirled with dark chocolate ganache, cold milk, and crushed ice.',
      fullDescription: 'Decadent dark chocolate syrup stirred with double espresso, whole milk, and served over ice with an optional swirl of fresh whipped cream.',
      price: 5.15,
      image: 'https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: false,
      ingredients: ['Espresso', 'Dark chocolate', 'Cold milk', 'Ice'],
      allergens: ['Dairy'],
      preparationTime: '3 mins',
      calories: 280,
      tags: ['Chocolate', 'Chilled'],
      createdAt: '2026-03-01T08:17:00Z',
    },
    {
      id: 'item_cold_brew',
      name: 'Signature Cold Brew',
      slug: 'signature-cold-brew',
      description: 'Coarse ground single-origin beans steeped in cold water for 18 hours for maximum smoothness and zero bitterness.',
      fullDescription: 'Our 18-hour slow cold brew extraction delivers an ultra-smooth, naturally sweet brew with chocolate undertones and low acidity.',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: false,
      ingredients: ['18-hour cold steeped coffee', 'Filtered water', 'Ice'],
      allergens: ['None'],
      preparationTime: '1 min',
      calories: 5,
      tags: ['Cold Brew', 'Smooth'],
      createdAt: '2026-03-01T08:18:00Z',
    },
    {
      id: 'item_vanilla_cold_brew',
      name: 'Vanilla Sweet Cream Cold Brew',
      slug: 'vanilla-cold-brew',
      description: 'Slow-steeped cold brew topped with a float of house-made vanilla sweet cream.',
      fullDescription: 'Our signature 18-hour cold brew layered with a cascade of house-made sweet cream infused with real Madagascar vanilla bean.',
      price: 4.95,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: false,
      ingredients: ['Cold brew', 'Heavy cream', 'Vanilla bean syrup'],
      allergens: ['Dairy'],
      preparationTime: '2 mins',
      calories: 140,
      tags: ['Cold Brew', 'Sweet Cream'],
      createdAt: '2026-03-01T08:19:00Z',
    },
    {
      id: 'item_caramel_cold_brew',
      name: 'Salted Caramel Cold Brew',
      slug: 'caramel-cold-brew',
      description: 'Cold brew topped with salted caramel cold foam and sea salt flakes.',
      fullDescription: 'Crisp cold brew crowned with airy whipped cold foam infused with dark caramel and sprinkled with crunchy sea salt crystals.',
      price: 4.95,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: false,
      ingredients: ['Cold brew', 'Caramel syrup', 'Salted cold foam'],
      allergens: ['Dairy'],
      preparationTime: '2 mins',
      calories: 160,
      tags: ['Cold Foam', 'Caramel'],
      createdAt: '2026-03-01T08:20:00Z',
    },
    {
      id: 'item_affogato',
      name: 'Traditional Affogato al Caffè',
      slug: 'affogato',
      description: 'A scoop of artisanal Madagascar vanilla bean gelato drowned in a hot shot of espresso.',
      fullDescription: 'An Italian dessert-coffee classic: rich velvety vanilla bean gelato served in a frozen glass, melted on the table with freshly pulled hot espresso.',
      price: 5.25,
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
      category: 'Cold Coffee',
      available: true,
      featured: false,
      ingredients: ['Double espresso', 'Madagascar vanilla gelato'],
      allergens: ['Dairy'],
      preparationTime: '2 mins',
      calories: 210,
      tags: ['Dessert', 'Gelato'],
      createdAt: '2026-03-01T08:21:00Z',
    },

    // 3. TEA & OTHER DRINKS
    {
      id: 'item_english_breakfast',
      name: 'English Breakfast Tea',
      slug: 'english-breakfast-tea',
      description: 'Robust blend of organic Assam, Ceylon, and Kenyan black tea leaves served with warm milk.',
      fullDescription: 'A classic full-bodied morning black tea with malty notes, golden amber liquor, and a brisk, satisfying finish. Served with organic milk and honey upon request.',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['Loose leaf organic black tea blend'],
      allergens: ['None'],
      preparationTime: '3-4 mins',
      calories: 5,
      tags: ['Tea', 'Organic'],
      createdAt: '2026-03-01T08:25:00Z',
    },
    {
      id: 'item_green_tea',
      name: 'Organic Sencha Green Tea',
      slug: 'green-tea',
      description: 'Steamed Japanese green tea leaves with grassy aroma, gentle umami, and sweet finish.',
      fullDescription: 'Hand-picked first-flush Japanese Sencha steeped at 75°C to bring out delicate antioxidant-rich sweetness without astringency.',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['Organic Sencha green tea leaves'],
      allergens: ['None'],
      preparationTime: '3 mins',
      calories: 0,
      tags: ['Green Tea', 'Antioxidants'],
      createdAt: '2026-03-01T08:26:00Z',
    },
    {
      id: 'item_chai_latte',
      name: 'Spiced Chai Latte',
      slug: 'spiced-chai-latte',
      description: 'Slow-simmered black tea steeped with cinnamon, cardamom, cloves, ginger, and steamed milk.',
      fullDescription: 'Whole spices cracked and brewed with Assam black tea, sweetened lightly with wildflower honey, and frothed with velvety steamed milk.',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['Black tea', 'Cinnamon', 'Cardamom', 'Ginger', 'Honey', 'Steamed milk'],
      allergens: ['Dairy'],
      preparationTime: '3-4 mins',
      calories: 180,
      tags: ['Chai', 'Spiced'],
      createdAt: '2026-03-01T08:27:00Z',
    },
    {
      id: 'item_masala_chai',
      name: 'Authentic Masala Chai',
      slug: 'masala-chai',
      description: 'Traditional stovetop boiled tea with crushed black peppercorns, fresh ginger, and spices.',
      fullDescription: 'Boiled traditionally in a saucepan with crushed fresh ginger root, whole spices, tea, and milk for genuine aromatic depth.',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['CTC Assam tea', 'Fresh ginger root', 'Spices', 'Whole milk'],
      allergens: ['Dairy'],
      preparationTime: '4 mins',
      calories: 160,
      tags: ['Authentic', 'Warming'],
      createdAt: '2026-03-01T08:28:00Z',
    },
    {
      id: 'item_hot_chocolate',
      name: 'Artisan Hot Chocolate',
      slug: 'hot-chocolate',
      description: 'Single-origin Colombian dark chocolate melted with whole milk, topped with toasted marshmallow.',
      fullDescription: 'Crafted by melting 65% single-origin chocolate disks directly into hot steamed milk. Creamy, deeply chocolatey, and topped with house marshmallow.',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['65% Colombian chocolate', 'Steamed milk', 'Marshmallow'],
      allergens: ['Dairy'],
      preparationTime: '3 mins',
      calories: 310,
      tags: ['Hot Chocolate', 'Cozy'],
      createdAt: '2026-03-01T08:29:00Z',
    },
    {
      id: 'item_matcha_latte',
      name: 'Ceremonial Matcha Latte',
      slug: 'matcha-latte',
      description: 'First-harvest Uji matcha whisked with warm bamboo chasen and blended with silky oat milk.',
      fullDescription: 'Ceremonial grade green tea stone-ground in Kyoto, whisked to a jade foam and paired with lightly steamed oat milk for an earthy, energizing balance.',
      price: 4.95,
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['Uji ceremonial matcha', 'Steamed oat milk'],
      allergens: ['None'],
      preparationTime: '3 mins',
      calories: 120,
      tags: ['Matcha', 'Superfood'],
      createdAt: '2026-03-01T08:30:00Z',
    },
    {
      id: 'item_fresh_lemonade',
      name: 'Fresh Mint Lemonade',
      slug: 'fresh-lemonade',
      description: 'Freshly squeezed lemons, crushed garden mint, and raw agave nectar over crushed ice.',
      fullDescription: 'Bright, zesty lemon juice pressed daily, muddled with fresh garden mint leaves and lightly sweetened with organic blue agave nectar.',
      price: 3.95,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      category: 'Tea & Other Drinks',
      available: true,
      featured: false,
      ingredients: ['Fresh lemon juice', 'Garden mint', 'Agave', 'Sparkling water'],
      allergens: ['None'],
      preparationTime: '2 mins',
      calories: 90,
      tags: ['Refreshing', 'Citrus'],
      createdAt: '2026-03-01T08:31:00Z',
    },

    // 4. BREAKFAST
    {
      id: 'item_croissant',
      name: 'Classic French Croissant',
      slug: 'classic-croissant',
      description: 'Laminated French dough baked fresh every morning with golden honeycomb layers and cultured butter.',
      fullDescription: 'Hand-laminated over three days using French Isigny Sainte-Mère cultured butter. Crisp crackling crust giving way to an airy, tender honeycomb interior.',
      price: 2.95,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['French wheat flour', 'Cultured butter', 'Yeast', 'Sea salt'],
      allergens: ['Gluten', 'Dairy'],
      preparationTime: 'Ready to serve',
      calories: 260,
      tags: ['Bakery', 'French'],
      createdAt: '2026-03-01T08:35:00Z',
    },
    {
      id: 'item_butter_croissant',
      name: 'Flaky Butter Croissant',
      slug: 'butter-croissant',
      description: 'Extra butter artisan croissant with deeply caramelized flaky shell and rich buttery crumb.',
      fullDescription: 'Baked to a deep golden amber with caramelized butter notes, ideal for dipping into your morning cappuccino or spreading with house berry jam.',
      price: 3.25,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['Enriched flour', 'Cultured European butter'],
      allergens: ['Gluten', 'Dairy'],
      preparationTime: 'Ready to serve',
      calories: 290,
      tags: ['Bakery', 'Pastry'],
      createdAt: '2026-03-01T08:36:00Z',
    },
    {
      id: 'item_chocolate_croissant',
      name: 'Pain au Chocolat (Chocolate Croissant)',
      slug: 'chocolate-croissant',
      description: 'Flaky laminated pastry rolled around two batons of semi-sweet dark French chocolate.',
      fullDescription: 'Rich buttery pastry layers enveloping two generous batons of 55% Cacao Barry French baking chocolate that melt when gently warmed.',
      price: 3.75,
      image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['Laminated dough', '55% French dark chocolate batons'],
      allergens: ['Gluten', 'Dairy', 'Soy'],
      preparationTime: 'Ready to serve',
      calories: 340,
      tags: ['Bakery', 'Chocolate'],
      createdAt: '2026-03-01T08:37:00Z',
    },
    {
      id: 'item_avocado_toast',
      name: 'Artisan Avocado Toast',
      slug: 'avocado-toast',
      description: 'Crushed Hass avocado on toasted country sourdough with radish, microgreens, and chili flakes.',
      fullDescription: 'Thick toasted slice of naturally leavened country sourdough topped with crushed Hass avocado, lemon juice, extra virgin olive oil, shaved watermelon radish, and Aleppo pepper flakes.',
      price: 5.95,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['Artisan sourdough', 'Hass avocado', 'Lemon', 'Microgreens', 'Aleppo pepper', 'EVOO'],
      allergens: ['Gluten'],
      preparationTime: '5-6 mins',
      calories: 320,
      tags: ['Healthy', 'Vegetarian', 'Brunch'],
      createdAt: '2026-03-01T08:38:00Z',
    },
    {
      id: 'item_eggs_toast',
      name: 'Farm Eggs & Sourdough Toast',
      slug: 'eggs-toast',
      description: 'Two pasture-raised organic eggs cooked to order with buttered artisanal sourdough toast.',
      fullDescription: 'Two fresh pasture-raised eggs (scrambled with butter or sunny-side up) served alongside grilled sourdough toast and whipped salted butter.',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['Organic pasture-raised eggs', 'Sourdough bread', 'Cultured butter', 'Sea salt'],
      allergens: ['Eggs', 'Gluten', 'Dairy'],
      preparationTime: '6-8 mins',
      calories: 380,
      tags: ['Eggs', 'Protein', 'Breakfast'],
      createdAt: '2026-03-01T08:39:00Z',
    },
    {
      id: 'item_pancake_stack',
      name: 'Buttermilk Pancake Stack',
      slug: 'pancake-stack',
      description: 'Three fluffy golden buttermilk pancakes served with whipped butter and pure Vermont maple syrup.',
      fullDescription: 'Melt-in-your-mouth tender pancakes made from scratch with cultured buttermilk, topped with a medallion of whipped butter and 100% Grade A maple syrup.',
      price: 7.50,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['Flour', 'Buttermilk', 'Eggs', 'Vanilla', 'Vermont maple syrup', 'Butter'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      preparationTime: '8-10 mins',
      calories: 520,
      tags: ['Pancakes', 'Sweet Breakfast'],
      createdAt: '2026-03-01T08:40:00Z',
    },
    {
      id: 'item_french_toast',
      name: 'Brioche French Toast',
      slug: 'french-toast',
      description: 'Custard-dipped thick brioche slice griddled golden, topped with fresh berries and powdered sugar.',
      fullDescription: 'Rich egg brioche soaked in cinnamon-vanilla custard, griddled with butter until caramelized, and garnished with fresh raspberries and blueberries.',
      price: 7.95,
      image: 'https://images.unsplash.com/photo-1484723091739-00a8a65c92be?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['All-butter brioche', 'Vanilla custard', 'Berries', 'Maple syrup'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      preparationTime: '8 mins',
      calories: 490,
      tags: ['French Toast', 'Brunch'],
      createdAt: '2026-03-01T08:41:00Z',
    },
    {
      id: 'item_breakfast_sandwich',
      name: 'Café Morning Breakfast Sandwich',
      slug: 'breakfast-sandwich',
      description: 'Fried organic egg, sharp aged cheddar, smoked bacon, and herb aioli on a toasted brioche bun.',
      fullDescription: 'Pasture-raised fried egg with a jammy yolk, applewood-smoked thick-cut bacon, melted Vermont cheddar, and house chive aioli in a soft brioche bun.',
      price: 6.25,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      category: 'Breakfast',
      available: true,
      featured: false,
      ingredients: ['Brioche bun', 'Organic egg', 'Applewood bacon', 'Aged cheddar', 'Chive aioli'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      preparationTime: '6-8 mins',
      calories: 460,
      tags: ['Hot Breakfast', 'Savory'],
      createdAt: '2026-03-01T08:42:00Z',
    },

    // 5. DESSERTS & PASTRIES
    {
      id: 'item_chocolate_cake',
      name: 'Belgian Chocolate Cake',
      slug: 'chocolate-cake',
      description: 'Multi-layered rich Belgian dark chocolate sponge topped with silky fudge and fresh blueberries.',
      fullDescription: 'Three layers of moist Belgian chocolate sponge cake filled and iced with 64% chocolate ganache, topped with a crown of fresh plump mountain blueberries.',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: true,
      ingredients: ['Belgian cocoa', 'Dark chocolate ganache', 'Flour', 'Butter', 'Blueberries'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 410,
      tags: ['Dessert', 'Chocolate', 'Popular'],
      createdAt: '2026-03-01T08:45:00Z',
    },
    {
      id: 'item_cheesecake',
      name: 'Berry Cheesecake',
      slug: 'berry-cheesecake',
      description: 'Velvety New York style baked cheesecake topped with raspberry compote and fresh berries.',
      fullDescription: 'Rich and dense baked cream cheese custard on a graham cracker butter crust, finished with tart wild raspberry coulis and fresh raspberries.',
      price: 4.25,
      image: '/images/cheesecake.jpg',
      category: 'Desserts & Pastries',
      available: true,
      featured: true,
      ingredients: ['Cream cheese', 'Graham cracker crust', 'Raspberry compote', 'Vanilla'],
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 390,
      tags: ['Cheesecake', 'Signature', 'Fruit'],
      createdAt: '2026-03-01T08:46:00Z',
    },
    {
      id: 'item_carrot_cake',
      name: 'Spiced Walnut Carrot Cake',
      slug: 'carrot-cake',
      description: 'Moist spiced sponge cake packed with shredded carrots, toasted walnuts, and cream cheese frosting.',
      fullDescription: 'Grated organic carrots, cinnamon, nutmeg, and toasted California walnuts baked into a moist cake, layered with tangy whipped cream cheese frosting.',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['Organic carrots', 'Walnuts', 'Cinnamon', 'Cream cheese frosting'],
      allergens: ['Gluten', 'Nuts (Walnuts)', 'Dairy', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 380,
      tags: ['Spiced', 'Cake'],
      createdAt: '2026-03-01T08:47:00Z',
    },
    {
      id: 'item_brownie',
      name: 'Fudgy Dark Chocolate Brownie',
      slug: 'chocolate-brownie',
      description: 'Intensely chocolatey fudge brownie with a crackly top, sea salt flakes, and chocolate chunks.',
      fullDescription: 'Baked with high cocoa butter content for a dense, fudgy center. Embedded with semi-sweet chocolate chunks and sprinkled with Maldon flaked salt.',
      price: 3.75,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['70% Dark chocolate', 'Butter', 'Eggs', 'Cocoa powder', 'Maldon salt'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 340,
      tags: ['Chocolate', 'Fudge'],
      createdAt: '2026-03-01T08:48:00Z',
    },
    {
      id: 'item_cinnamon_roll',
      name: 'Cardamom Cinnamon Roll',
      slug: 'cinnamon-roll',
      description: 'Warm pillowy yeast dough swirled with Korintje cinnamon, cardamom butter, and cream cheese glaze.',
      fullDescription: 'Swedish-inspired brioche dough spiced with freshly crushed green cardamom, layered with cinnamon brown sugar butter, and drizzled with vanilla glaze.',
      price: 3.95,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['Brioche dough', 'Korintje cinnamon', 'Cardamom', 'Cream cheese glaze'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: 'Warmed 1 min',
      calories: 420,
      tags: ['Pastry', 'Warm'],
      createdAt: '2026-03-01T08:49:00Z',
    },
    {
      id: 'item_blueberry_muffin',
      name: 'Wild Blueberry Streusel Muffin',
      slug: 'blueberry-muffin',
      description: 'Tender sour cream muffin bursting with wild Maine blueberries, topped with cinnamon streusel.',
      fullDescription: 'Packed with tart wild blueberries that burst during baking, with a tender sour cream crumb and a crunchy butter streusel topping.',
      price: 3.25,
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['Wild blueberries', 'Sour cream', 'Flour', 'Butter streusel'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 310,
      tags: ['Muffin', 'Fruit'],
      createdAt: '2026-03-01T08:50:00Z',
    },
    {
      id: 'item_chocolate_muffin',
      name: 'Double Chocolate Chunk Muffin',
      slug: 'chocolate-muffin',
      description: 'Rich dark cocoa muffin loaded with melted milk and dark chocolate chunks.',
      fullDescription: 'For serious chocolate fans: dark chocolate batter filled with two varieties of chocolate chunks, soft inside with a domed crackled top.',
      price: 3.25,
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['Dutch cocoa', 'Chocolate chunks', 'Buttermilk'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 360,
      tags: ['Muffin', 'Chocolate'],
      createdAt: '2026-03-01T08:51:00Z',
    },
    {
      id: 'item_tiramisu',
      name: 'Classic Venetian Tiramisu',
      slug: 'classic-tiramisu',
      description: 'Espresso-soaked ladyfingers layered with whipped mascarpone cream and dusted with cocoa.',
      fullDescription: 'Made the traditional Italian way with Savoiardi biscuits drenched in our signature espresso, layered with whipped mascarpone, Marsala wine essence, and Valrhona cocoa.',
      price: 5.25,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['Savoiardi ladyfingers', 'Espresso', 'Mascarpone cheese', 'Cocoa powder'],
      allergens: ['Dairy', 'Eggs', 'Gluten'],
      preparationTime: 'Ready to serve',
      calories: 360,
      tags: ['Italian', 'Coffee Dessert'],
      createdAt: '2026-03-01T08:52:00Z',
    },
    {
      id: 'item_fruit_tart',
      name: 'Seasonal Fresh Fruit Tart',
      slug: 'fruit-tart',
      description: 'Crisp sweet pastry crust filled with Madagascar vanilla bean pastry cream and glazed berries.',
      fullDescription: 'Pâte sablée tart shell brushed with chocolate, filled with silky chilled vanilla pastry cream, and arranged with fresh seasonal kiwi, strawberries, and blackberries.',
      price: 4.75,
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      category: 'Desserts & Pastries',
      available: true,
      featured: false,
      ingredients: ['Sweet tart shell', 'Vanilla bean pastry cream', 'Fresh berries', 'Apricot glaze'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: 'Ready to serve',
      calories: 280,
      tags: ['Tart', 'Fruit', 'Pastry'],
      createdAt: '2026-03-01T08:53:00Z',
    },

    // 6. SANDWICHES & LIGHT MEALS
    {
      id: 'item_chicken_sandwich',
      name: 'Grilled Herb Chicken Sandwich',
      slug: 'chicken-sandwich',
      description: 'Herb-marinated grilled chicken breast, crisp romaine, ripe tomato, and pesto aioli on toasted ciabatta.',
      fullDescription: 'Free-range chicken breast marinated in rosemary, garlic, and olive oil, char-grilled and served on freshly baked crusty ciabatta bread with garden greens, vine tomatoes, and basil aioli.',
      price: 6.50,
      image: '/images/sandwich.jpg',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: true,
      ingredients: ['Grilled chicken breast', 'Artisan ciabatta', 'Romaine lettuce', 'Tomato', 'Basil pesto aioli'],
      allergens: ['Gluten', 'Eggs (Aioli)'],
      preparationTime: '6-8 mins',
      calories: 520,
      tags: ['Savory', 'Lunch', 'Chef Special'],
      createdAt: '2026-03-01T08:55:00Z',
    },
    {
      id: 'item_grilled_cheese',
      name: 'Three-Cheese Artisan Grilled Cheese',
      slug: 'grilled-cheese',
      description: 'Aged white cheddar, Gruyère, and fontina melted on buttery sourdough with a hint of Dijon.',
      fullDescription: 'Thick sourdough slices spread with European butter and griddled until golden, melting aged sharp cheddar, Swiss Gruyère, and creamy fontina cheese.',
      price: 5.50,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Country sourdough', 'Aged Cheddar', 'Gruyère', 'Fontina', 'Cultured butter'],
      allergens: ['Gluten', 'Dairy'],
      preparationTime: '5 mins',
      calories: 480,
      tags: ['Cheese', 'Comfort Food'],
      createdAt: '2026-03-01T08:56:00Z',
    },
    {
      id: 'item_turkey_sandwich',
      name: 'Smoked Turkey & Havarti Sandwich',
      slug: 'turkey-sandwich',
      description: 'Thinly sliced smoked turkey breast, creamy Havarti, honey mustard, and greens on seeded multigrain.',
      fullDescription: 'Herb-roasted smoked turkey paired with Danish creamy Havarti cheese, crisp Persian cucumbers, mixed baby greens, and stoneground honey mustard on multigrain.',
      price: 6.75,
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Smoked turkey breast', 'Havarti cheese', 'Multigrain bread', 'Honey mustard', 'Cucumbers'],
      allergens: ['Gluten', 'Dairy'],
      preparationTime: '5 mins',
      calories: 440,
      tags: ['Deli', 'Healthy'],
      createdAt: '2026-03-01T08:57:00Z',
    },
    {
      id: 'item_club_sandwich',
      name: 'Triple-Decker Café Club Sandwich',
      slug: 'club-sandwich',
      description: 'Smoked turkey, crispy bacon, aged cheddar, lettuce, tomato, and mayo on three slices of toasted sourdough.',
      fullDescription: 'Classic café staple stacked high with roast turkey, applewood bacon strips, sharp cheddar, vine-ripened tomatoes, and house mayonnaise on toasted sourdough.',
      price: 7.25,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Toasted sourdough', 'Smoked turkey', 'Crispy bacon', 'Cheddar', 'Lettuce', 'Tomato'],
      allergens: ['Gluten', 'Dairy', 'Eggs'],
      preparationTime: '7 mins',
      calories: 590,
      tags: ['Hearty', 'Club'],
      createdAt: '2026-03-01T08:58:00Z',
    },
    {
      id: 'item_chicken_panini',
      name: 'Tuscan Chicken & Mozzarella Panini',
      slug: 'chicken-panini',
      description: 'Grilled chicken, fresh mozzarella, sun-dried tomatoes, and basil pesto pressed warm on focaccia.',
      fullDescription: 'Rosemary focaccia bread pressed hot in the panini press with grilled chicken, melted buffalo mozzarella, tangy sun-dried tomatoes, and nut-free basil pesto.',
      price: 6.95,
      image: '/images/sandwich.jpg',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Rosemary focaccia', 'Grilled chicken', 'Fresh mozzarella', 'Sun-dried tomatoes', 'Pesto'],
      allergens: ['Gluten', 'Dairy'],
      preparationTime: '6-8 mins',
      calories: 540,
      tags: ['Panini', 'Warm'],
      createdAt: '2026-03-01T08:59:00Z',
    },
    {
      id: 'item_veggie_panini',
      name: 'Roasted Veggie & Goat Cheese Panini',
      slug: 'veggie-panini',
      description: 'Grilled zucchini, roasted red peppers, caramelized onions, and chèvre goat cheese on ciabatta.',
      fullDescription: 'Tender fire-roasted sweet bell peppers, grilled zucchini ribbons, sweet balsamic caramelized onions, and creamy chèvre spread on crusty ciabatta.',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Ciabatta', 'Roasted bell peppers', 'Grilled zucchini', 'Caramelized onions', 'Goat cheese'],
      allergens: ['Gluten', 'Dairy'],
      preparationTime: '6-7 mins',
      calories: 410,
      tags: ['Vegetarian', 'Panini'],
      createdAt: '2026-03-01T09:00:00Z',
    },
    {
      id: 'item_caesar_salad',
      name: 'Parmesan Crisp Caesar Salad',
      slug: 'caesar-salad',
      description: 'Crisp romaine hearts, shaved 24-month Parmigiano-Reggiano, house garlic sourdough croutons, and creamy Caesar dressing.',
      fullDescription: 'Torn crisp hearts of romaine lettuce tossed in house-made creamy garlic anchovy dressing, crowned with sourdough croutons and thick ribbons of aged Parmigiano.',
      price: 6.25,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Romaine hearts', 'Parmigiano-Reggiano', 'Sourdough croutons', 'Caesar dressing'],
      allergens: ['Dairy', 'Eggs', 'Fish (Anchovy)', 'Gluten'],
      preparationTime: '4 mins',
      calories: 320,
      tags: ['Salad', 'Fresh'],
      createdAt: '2026-03-01T09:01:00Z',
    },
    {
      id: 'item_pasta_day',
      name: 'Artisan Pasta of the Day',
      slug: 'pasta-of-the-day',
      description: 'Fresh handmade tagliatelle tossed in slow-simmered San Marzano tomato sauce, fresh basil, and burrata.',
      fullDescription: 'Prepared fresh daily by our kitchen: handmade egg tagliatelle cooked al dente, tossed in sweet San Marzano tomato pomodoro sauce, and crowned with a ball of creamy Pugliese burrata.',
      price: 7.95,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      category: 'Sandwiches & Light Meals',
      available: true,
      featured: false,
      ingredients: ['Fresh egg tagliatelle', 'San Marzano tomatoes', 'Fresh basil', 'Burrata cheese', 'EVOO'],
      allergens: ['Gluten', 'Eggs', 'Dairy'],
      preparationTime: '8-10 mins',
      calories: 580,
      tags: ['Pasta', 'Warm Meal'],
      createdAt: '2026-03-01T09:02:00Z',
    },
  ];
}

export function getInitialGallery(): GalleryImage[] {
  return [
    {
      id: 'gal_1',
      title: 'Artisan Morning Spread',
      category: 'Food & Coffee',
      imageUrl: '/images/hero.jpg',
      caption: 'Freshly baked croissants and signature latte art to kickstart your day.',
      published: true,
      createdAt: '2026-03-01T09:00:00Z',
    },
    {
      id: 'gal_2',
      title: 'Barista Milk Pouring Craft',
      category: 'Barista Craft',
      imageUrl: '/images/barista.jpg',
      caption: 'Steaming microfoam to silky perfection at 65°C.',
      published: true,
      createdAt: '2026-03-01T09:10:00Z',
    },
    {
      id: 'gal_3',
      title: 'Velvety Berry Cheesecake',
      category: 'Desserts',
      imageUrl: '/images/cheesecake.jpg',
      caption: 'Made with organic cream cheese and wild mountain berry coulis.',
      published: true,
      createdAt: '2026-03-01T09:20:00Z',
    },
    {
      id: 'gal_4',
      title: 'Cappuccino Rosette Art',
      category: 'Food & Coffee',
      imageUrl: '/images/coffee.jpg',
      caption: 'Double shot espresso balanced with creamy microfoam.',
      published: true,
      createdAt: '2026-03-01T09:30:00Z',
    },
    {
      id: 'gal_5',
      title: 'Gourmet Ciabatta Sandwiches',
      category: 'Food & Coffee',
      imageUrl: '/images/sandwich.jpg',
      caption: 'Toasted artisan breads filled with local farm ingredients.',
      published: true,
      createdAt: '2026-03-01T09:40:00Z',
    },
    {
      id: 'gal_6',
      title: 'Warm Rustic Seating',
      category: 'Atmosphere',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      caption: 'A sunny quiet corner for reading, working, and catching up.',
      published: true,
      createdAt: '2026-03-01T09:50:00Z',
    },
    {
      id: 'gal_7',
      title: 'Espresso Bar Alchemy',
      category: 'Barista Craft',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      caption: 'Calibrating burr grinders down to the micron every morning.',
      published: true,
      createdAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'gal_8',
      title: 'Sunlit Reading Nook',
      category: 'Atmosphere',
      imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80',
      caption: 'Natural oak tables and ambient warmth in the heart of the city.',
      published: true,
      createdAt: '2026-03-01T10:10:00Z',
    },
  ];
}

function getInitialData(): DatabaseSchema {
  return {
    orderCounter: 100,
    users: [
      {
        id: 'usr_admin',
        name: 'Head Barista & Manager',
        email: 'admin@cafe.com',
        passwordHash: hashPassword('adminpassword123'),
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ],
    categories: getInitialCategories(),
    menuItems: getInitialMenuItems(),
    orders: [
      {
        id: 'ord_101',
        orderNumber: 'CAF-2026-0001',
        customerName: 'Eleanor Vance',
        email: 'eleanor@example.com',
        phone: '+1 (555) 234-8901',
        orderType: 'pickup',
        items: [
          { menuItemId: 'item_cappuccino', name: 'Cappuccino', price: 3.50, quantity: 2, specialInstructions: 'Oat milk please' },
          { menuItemId: 'item_cheesecake', name: 'Berry Cheesecake', price: 4.25, quantity: 1 },
        ],
        subtotal: 11.25,
        tax: 0.90,
        deliveryFee: 0,
        total: 12.15,
        status: 'Preparing',
        notes: 'Ready by 10:30 AM',
        estimatedTime: '15-20 mins',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'ord_102',
        orderNumber: 'CAF-2026-0002',
        customerName: 'Marcus Bennett',
        email: 'marcus.b@example.com',
        phone: '+1 (555) 789-1234',
        orderType: 'delivery',
        deliveryAddress: '428 Elm Street, Apt 3B',
        items: [
          { menuItemId: 'item_chicken_sandwich', name: 'Grilled Herb Chicken Sandwich', price: 6.50, quantity: 2 },
          { menuItemId: 'item_iced_latte', name: 'Iced Latte', price: 4.00, quantity: 2 },
        ],
        subtotal: 21.00,
        tax: 1.68,
        deliveryFee: 3.50,
        total: 26.18,
        status: 'Confirmed',
        notes: 'Ring doorbell 3B',
        estimatedTime: '25-35 mins',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    reservations: [
      {
        id: 'res_201',
        name: 'Sophia Laurent',
        email: 'sophia@example.com',
        phone: '+1 (555) 456-7890',
        date: '2026-10-08',
        time: '14:00',
        guests: 3,
        specialRequest: 'Window table if available for casual business meeting',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'res_202',
        name: 'David Kim',
        email: 'david.k@example.com',
        phone: '+1 (555) 890-4321',
        date: '2026-10-09',
        time: '10:30',
        guests: 2,
        specialRequest: 'Anniversary morning coffee',
        status: 'Pending',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
    contactMessages: [
      {
        id: 'msg_301',
        name: 'Hannah Abbott',
        email: 'hannah@example.com',
        phone: '+1 (555) 678-9012',
        subject: 'Catering for Weekend Book Club',
        message: 'Hello! We are hosting a 12-person book club gathering next Saturday morning. Do you provide pastry box catering and pump pots of brewed coffee?',
        isRead: false,
        createdAt: new Date(Date.now() - 5400000).toISOString(),
      },
    ],
    newsletterSubscribers: [
      {
        id: 'sub_401',
        email: 'coffee.enthusiast@example.com',
        subscribedAt: '2026-03-01T12:00:00Z',
        active: true,
      },
      {
        id: 'sub_402',
        email: 'ranaahmaed2407@gmail.com',
        subscribedAt: '2026-03-02T15:30:00Z',
        active: true,
      },
    ],
    blogPosts: [
      {
        id: 'post_1',
        title: 'The Art of Slow Brewing: Bean to Cup',
        slug: 'the-art-of-slow-brewing',
        excerpt: 'Discover the meticulous roasting curve, extraction pressure, and temperature profiles that bring out floral and chocolate notes.',
        content: `At our café, brewing is treated as both a craft and a mindfulness ritual. Every morning begins with calibrating the grinder burrs down to the micron. 

### Why Sourcing Matters
We partner directly with high-elevation micro-lot farms in Ethiopia and Colombia. By paying above fair-trade premiums, we guarantee access to hand-picked cherries grown under canopy shade.

### The Pour-Over Technique
Water heated to precisely 93°C is poured in gentle concentric circles over freshly ground beans. The bloom phase releases trapped carbon dioxide, awakening delicate floral aromatics before the steady extraction produces a clean, sweet cup.

Visit us this weekend and ask our head barista for a tasting flight of this season's washed Geisha lot!`,
        image: '/images/barista.jpg',
        author: 'Julian Thorne, Head Barista',
        readTime: '4 min read',
        published: true,
        createdAt: '2026-03-02T10:00:00Z',
      },
      {
        id: 'post_2',
        title: 'Pairing Espresso with Handcrafted Pastries',
        slug: 'pairing-espresso-with-pastries',
        excerpt: 'How the bright acidity of single-origin coffee cuts through buttery croissant laminations and dark cocoa.',
        content: `Finding harmony between pastry and espresso is a culinary balance. The rich fat content of French European butter in our laminated croissants coats the palate, creating the ideal canvas for high-altitude espresso.

When enjoying our signature Cappuccino, pair it with our freshly baked fruit tart or berry cheesecake to experience a delightful play of tart berry brightness against toasted caramel crema.`,
        image: '/images/hero.jpg',
        author: 'Elena Rostova, Pastry Chef',
        readTime: '3 min read',
        published: true,
        createdAt: '2026-03-04T14:30:00Z',
      },
      {
        id: 'post_3',
        title: 'Designing a Cozy Sanctuary in the Heart of the City',
        slug: 'designing-a-cozy-sanctuary',
        excerpt: 'Natural oak, warm diffused lighting, and acoustic tranquility: creating your daily home away from home.',
        content: `A great café is more than coffee; it is a refuge. When designing our space, we focused on tactile natural materials: reclaimed oak, warm terracotta tiling, live greenery, and low-frequency ambient music tuned for deep focus and intimate conversations.`,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        author: 'Liam Chen, Creative Director',
        readTime: '5 min read',
        published: true,
        createdAt: '2026-03-05T09:15:00Z',
      },
    ],
    galleryImages: getInitialGallery(),
  };
}

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  public isMongoConnected = false;

  constructor() {
    this.data = getInitialData();
  }

  public async init() {
    if (this.isLoaded) return;

    // 1. Try file DB persistence
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...getInitialData(),
          ...parsed,
        };
        // Guarantee large menu items if old small file existed
        if (!this.data.menuItems || this.data.menuItems.length < 15) {
          this.data.menuItems = getInitialMenuItems();
          this.data.categories = getInitialCategories();
          this.data.galleryImages = getInitialGallery();
          this.save();
        }
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('[DB] Error loading file database:', err);
      this.data = getInitialData();
      this.isLoaded = true;
    }

    // 2. Try MongoDB Atlas / local MongoDB connection if MONGODB_URI is provided
    if (MONGODB_URI) {
      try {
        console.log('[MongoDB] Connecting to MongoDB from process.env.MONGODB_URI...');
        this.mongoClient = new MongoClient(MONGODB_URI, {
          connectTimeoutMS: 5000,
          serverSelectionTimeoutMS: 5000,
        });
        await this.mongoClient.connect();
        this.mongoDb = this.mongoClient.db();
        this.isMongoConnected = true;
        console.log('[MongoDB] Successfully connected to MongoDB database!');

        // Seed Mongo collections if empty
        const count = await this.mongoDb.collection('menuItems').countDocuments();
        if (count === 0) {
          console.log('[MongoDB] Seeding initial menu items to MongoDB...');
          await this.mongoDb.collection('menuItems').insertMany(this.data.menuItems as any);
          await this.mongoDb.collection('categories').insertMany(this.data.categories as any);
          await this.mongoDb.collection('gallery').insertMany(this.data.galleryImages as any);
          await this.mongoDb.collection('blog').insertMany(this.data.blogPosts as any);
          await this.mongoDb.collection('users').insertMany(this.data.users as any);
        }
      } catch (err) {
        console.warn('[MongoDB] MongoDB connection failed or unreachable. Seamlessly continuing with persistent document store:', (err as any).message);
        this.isMongoConnected = false;
      }
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error writing to file:', err);
    }
  }

  public resetToSeed() {
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  // Getters
  public get users() { return this.data.users; }
  public get categories() { return this.data.categories; }
  public get menuItems() { return this.data.menuItems; }
  public get orders() { return this.data.orders; }
  public get reservations() { return this.data.reservations; }
  public get contactMessages() { return this.data.contactMessages; }
  public get newsletterSubscribers() { return this.data.newsletterSubscribers; }
  public get blogPosts() { return this.data.blogPosts; }
  public get galleryImages() { return this.data.galleryImages; }

  // Mutations
  public addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): MenuItem {
    const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newItem: MenuItem = {
      ...item,
      slug,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.menuItems.unshift(newItem);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('menuItems').insertOne(newItem as any).catch(console.error);
    }

    return newItem;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const index = this.data.menuItems.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.data.menuItems[index] = {
      ...this.data.menuItems[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('menuItems').updateOne({ id }, { $set: updates }).catch(console.error);
    }

    return this.data.menuItems[index];
  }

  public deleteMenuItem(id: string): boolean {
    const prevLen = this.data.menuItems.length;
    this.data.menuItems = this.data.menuItems.filter(i => i.id !== id);
    const deleted = this.data.menuItems.length !== prevLen;
    if (deleted) {
      this.save();
      if (this.isMongoConnected && this.mongoDb) {
        this.mongoDb.collection('menuItems').deleteOne({ id }).catch(console.error);
      }
    }
    return deleted;
  }

  public addOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    this.data.orderCounter = (this.data.orderCounter || 100) + 1;
    const year = new Date().getFullYear();
    const orderNumber = `CAF-${year}-${String(this.data.orderCounter).padStart(4, '0')}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      estimatedTime: orderData.orderType === 'delivery' ? '30-40 mins' : '15-20 mins',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('orders').insertOne(newOrder as any).catch(console.error);
    }

    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('orders').updateOne({ $or: [{ id }, { orderNumber: id }] }, { $set: { status, updatedAt: order.updatedAt } }).catch(console.error);
    }

    return order;
  }

  public addReservation(resData: Omit<Reservation, 'id' | 'createdAt'>): Reservation {
    const newReservation: Reservation = {
      ...resData,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.reservations.unshift(newReservation);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('reservations').insertOne(newReservation as any).catch(console.error);
    }

    return newReservation;
  }

  public updateReservationStatus(id: string, status: Reservation['status']): Reservation | null {
    const res = this.data.reservations.find(r => r.id === id);
    if (!res) return null;
    res.status = status;
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('reservations').updateOne({ id }, { $set: { status } }).catch(console.error);
    }

    return res;
  }

  public addContactMessage(msgData: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('contactMessages').insertOne(newMsg as any).catch(console.error);
    }

    return newMsg;
  }

  public markMessageRead(id: string): ContactMessage | null {
    const msg = this.data.contactMessages.find(m => m.id === id);
    if (!msg) return null;
    msg.isRead = true;
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('contactMessages').updateOne({ id }, { $set: { isRead: true } }).catch(console.error);
    }

    return msg;
  }

  public addNewsletterSubscriber(email: string): { subscriber: NewsletterSubscriber; isNew: boolean } {
    const existing = this.data.newsletterSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.active = true;
      this.save();
      return { subscriber: existing, isNew: false };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub_${Date.now()}`,
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      active: true,
    };
    this.data.newsletterSubscribers.unshift(newSub);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('newsletterSubscribers').insertOne(newSub as any).catch(console.error);
    }

    return { subscriber: newSub, isNew: true };
  }

  public addBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt'>): BlogPost {
    const newPost: BlogPost = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.blogPosts.unshift(newPost);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('blog').insertOne(newPost as any).catch(console.error);
    }

    return newPost;
  }

  public updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const index = this.data.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.blogPosts[index] = { ...this.data.blogPosts[index], ...updates };
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('blog').updateOne({ id }, { $set: updates }).catch(console.error);
    }

    return this.data.blogPosts[index];
  }

  public deleteBlogPost(id: string): boolean {
    const prev = this.data.blogPosts.length;
    this.data.blogPosts = this.data.blogPosts.filter(p => p.id !== id);
    const deleted = this.data.blogPosts.length !== prev;
    if (deleted) {
      this.save();
      if (this.isMongoConnected && this.mongoDb) {
        this.mongoDb.collection('blog').deleteOne({ id }).catch(console.error);
      }
    }
    return deleted;
  }

  public addGalleryImage(imgData: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
    const newImg: GalleryImage = {
      ...imgData,
      id: `gal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.galleryImages.unshift(newImg);
    this.save();

    if (this.isMongoConnected && this.mongoDb) {
      this.mongoDb.collection('gallery').insertOne(newImg as any).catch(console.error);
    }

    return newImg;
  }

  public deleteGalleryImage(id: string): boolean {
    const prev = this.data.galleryImages.length;
    this.data.galleryImages = this.data.galleryImages.filter(g => g.id !== id);
    const deleted = this.data.galleryImages.length !== prev;
    if (deleted) {
      this.save();
      if (this.isMongoConnected && this.mongoDb) {
        this.mongoDb.collection('gallery').deleteOne({ id }).catch(console.error);
      }
    }
    return deleted;
  }
}

export const db = new Database();
db.init().catch(console.error);
