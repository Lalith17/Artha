import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

export async function connectToMongoDB(): Promise<Db> {
  try {
    if (db) {
      return db;
    }

    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    const dbName = process.env.MONGODB_DB || "finance_manager";

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);

    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    return await connectToMongoDB();
  }
  return db;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
  }
}
