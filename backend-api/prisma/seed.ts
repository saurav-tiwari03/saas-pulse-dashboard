import path from "path";
import dotenv from "dotenv";

// Load environment file
const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import crypto from "crypto";

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");

  // Delete in order to respect foreign key constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared");
}

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clear all existing data first
  await clearDatabase();

  console.log("\n📝 Creating seed data...\n");

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashPassword("admin123"),
      name: "Admin User",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashPassword("user123"),
      name: "Test User",
      phone: "1234567890",
      role: "USER",
    },
  });
  console.log("✅ Test user created:", user.email);

  // Create address for test user
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      name: "Test User",
      phone: "1234567890",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isDefault: true,
    },
  });
  console.log("✅ Address created for test user");

  // Create categories
  const jacketsCategory = await prisma.category.create({
    data: { name: "Men's Jackets", description: "Stylish jackets for men" },
  });

  const dressesCategory = await prisma.category.create({
    data: { name: "Women's Dresses", description: "Beautiful dresses for women" },
  });

  const tshirtsCategory = await prisma.category.create({
    data: { name: "T-Shirts", description: "Casual t-shirts for all" },
  });

  const jeansCategory = await prisma.category.create({
    data: { name: "Jeans", description: "Denim jeans collection" },
  });

  console.log("✅ Categories created: 4");

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Classic Denim Jacket",
        description: "A timeless denim jacket for everyday wear. Made with premium quality denim.",
        price: 79.99,
        comparePrice: 99.99,
        sku: "MJ-001",
        stock: 50,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Black"],
        categoryId: jacketsCategory.id,
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Leather Jacket",
        description: "Premium leather jacket with modern fit. Perfect for any occasion.",
        price: 149.99,
        sku: "MJ-002",
        stock: 30,
        sizes: ["M", "L", "XL"],
        colors: ["Black", "Brown"],
        categoryId: jacketsCategory.id,
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Puffer Jacket",
        description: "Warm and cozy puffer jacket for cold weather.",
        price: 119.99,
        comparePrice: 149.99,
        sku: "MJ-003",
        stock: 25,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy", "Green"],
        categoryId: jacketsCategory.id,
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1544923246-77307dd628b8?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Summer Floral Dress",
        description: "Light and airy summer dress with beautiful floral pattern.",
        price: 59.99,
        comparePrice: 79.99,
        sku: "WD-001",
        stock: 40,
        sizes: ["XS", "S", "M", "L"],
        colors: ["Red", "Blue", "White"],
        categoryId: dressesCategory.id,
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Evening Gown",
        description: "Elegant evening gown for special occasions.",
        price: 189.99,
        sku: "WD-002",
        stock: 15,
        sizes: ["S", "M", "L"],
        colors: ["Black", "Red", "Navy"],
        categoryId: dressesCategory.id,
        isFeatured: false,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Casual Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt for everyday wear.",
        price: 24.99,
        sku: "TS-001",
        stock: 100,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Gray", "Navy"],
        categoryId: tshirtsCategory.id,
        isFeatured: false,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Graphic Print T-Shirt",
        description: "Trendy graphic print t-shirt with unique designs.",
        price: 29.99,
        sku: "TS-002",
        stock: 75,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black"],
        categoryId: tshirtsCategory.id,
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Slim Fit Jeans",
        description: "Modern slim fit denim jeans with comfortable stretch.",
        price: 69.99,
        sku: "JN-001",
        stock: 60,
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Blue", "Black", "Gray"],
        categoryId: jeansCategory.id,
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
      },
    }),
    prisma.product.create({
      data: {
        name: "Relaxed Fit Jeans",
        description: "Comfortable relaxed fit jeans for casual wear.",
        price: 59.99,
        comparePrice: 74.99,
        sku: "JN-002",
        stock: 45,
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Blue", "Light Blue"],
        categoryId: jeansCategory.id,
        isFeatured: false,
        images: ["https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400"],
      },
    }),
  ]);

  console.log("✅ Products created:", products.length);

  console.log("\n🎉 Seeding complete!\n");
  console.log("═".repeat(50));
  console.log("\n📝 Admin Credentials:");
  console.log("   Email:    admin@example.com");
  console.log("   Password: admin123");
  console.log("\n📝 Test User Credentials:");
  console.log("   Email:    user@example.com");
  console.log("   Password: user123");
  console.log("\n" + "═".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
