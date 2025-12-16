import { MongoClient, Db } from "mongodb";
import cron from "node-cron";

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/portfolio";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function initDatabase() {
  try {
    client = new MongoClient(DATABASE_URL);
    await client.connect();
    db = client.db("portfolio");

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("contacts")) {
      await db.createCollection("contacts");
      // Create TTL index to auto-delete old documents
      await db.collection("contacts").createIndex(
        { createdAt: 1 },
        { 
          expireAfterSeconds: 31536000 // 365 days in seconds
        }
      );
      console.log("Created 'contacts' collection with TTL index");
    }

    if (!collectionNames.includes("portfolio_context")) {
      await db.createCollection("portfolio_context");
      console.log("Created 'portfolio_context' collection");
    }

    console.log("✅ MongoDB connected successfully");

    // Schedule cleanup job for Jan 1st at 00:00
    scheduleYearlyCleanup();
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}

// Schedule yearly cleanup for Jan 1st at 00:00
function scheduleYearlyCleanup() {
  // Cron expression: 0 0 1 1 * (midnight on Jan 1st every year)
  cron.schedule("0 0 1 1 *", async () => {
    try {
      if (!db) return;

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const result = await db.collection("contacts").deleteMany({
        createdAt: { $lt: oneYearAgo }
      });

      console.log(
        `🧹 Yearly cleanup: Deleted ${result.deletedCount} contacts older than 1 year`
      );
    } catch (error) {
      console.error("❌ Cleanup job error:", error);
    }
  });

  console.log("📅 Scheduled yearly cleanup for Jan 1st at 00:00");
}

// Helper function to get one year ago date
export function getOneYearAgoDate(): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

