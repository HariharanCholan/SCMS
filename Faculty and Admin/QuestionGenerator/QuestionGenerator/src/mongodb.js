import { MongoClient, ObjectId } from 'mongodb';

// Configuration - Use environment variables for security
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://HARIHARAN:Hari0519@scms.wnt7tx1.mongodb.net/document_db?retryWrites=true&w=majority&appName=SCMS";
const DB_NAME = "document_db";

// Connection settings (optimized for production)
const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  maxPoolSize: 50, // Increased for better concurrency
  socketTimeoutMS: 45000, // Close idle connections after 45s
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
  appName: "doc-quest-app",
  compressors: "snappy" // Enable compression
};

// Global cached connection
let cachedClient = null;
let cachedDb = null;

/**
 * Establishes connection to MongoDB Atlas
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      // Verify existing connection is still alive
      await cachedClient.db(DB_NAME).command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (err) {
      console.warn("Existing connection failed, reconnecting...");
      await closeConnection();
    }
  }

  const client = new MongoClient(MONGO_URI, CONNECTION_OPTIONS);

  try {
    await client.connect();
    
    // Verify connection with a ping command
    const db = client.db(DB_NAME);
    await db.command({ ping: 1 });
    
    console.log("✅ MongoDB Atlas connection established");
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    await client.close().catch(() => null);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

/**
 * Safely closes the database connection
 */
export async function closeConnection() {
  if (cachedClient) {
    try {
      await cachedClient.close();
      console.log("🛑 MongoDB connection closed gracefully");
    } catch (err) {
      console.error("Error closing connection:", err);
    } finally {
      cachedClient = null;
      cachedDb = null;
    }
  }
}

// Enhanced CRUD Operations
export const dbOperations = {
  /**
   * Inserts a new document
   * @param {Object} documentData 
   * @returns {Promise<InsertOneResult>}
   */
  insertDocument: async (documentData) => {
    const { db } = await connectToDatabase();
    
    try {
      const result = await db.collection('documents').insertOne({
        ...documentData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      });
      
      console.log(`Inserted document with ID: ${result.insertedId}`);
      return result;
    } catch (err) {
      console.error("Insert failed:", err);
      throw err;
    }
  },

  /**
   * Finds a document by ID
   * @param {string} documentId 
   * @returns {Promise<Document|null>}
   */
  getDocument: async (documentId) => {
    const { db } = await connectToDatabase();
    
    try {
      return await db.collection('documents').findOne({ 
        _id: new ObjectId(documentId) 
      });
    } catch (err) {
      console.error("Find operation failed:", err);
      throw err;
    }
  },

  /**
   * Deletes a document by ID
   * @param {string} documentId 
   * @returns {Promise<DeleteResult>}
   */
  deleteDocument: async (documentId) => {
    if (!ObjectId.isValid(documentId)) {
      throw new Error('Invalid document ID');
    }
    const { db } = await connectToDatabase();
    try {
      const result = await db.collection('documents').deleteOne({ _id: new ObjectId(documentId) });
      if (result.deletedCount === 0) {
        throw new Error('Document not found');
      }
      console.log(`Deleted document with ID: ${documentId}`);
      return result;
    } catch (err) {
      console.error('Delete operation failed:', err);
      throw err;
    }
  }
};

// Initialize connection when imported
(async () => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Initial connection attempt failed:", err);
  }
})();

// Handle process termination
const cleanup = async () => {
  await closeConnection();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
  console.error("💥 Uncaught Exception:", err);
  cleanup();
});
