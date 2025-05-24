import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI не визначено");
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
console.log("🔗 MONGODB_URI (обрізаний):", uri.slice(0, 20), "...");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  console.log("👷 Режим: Development");
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    console.log("🔌 Підключення до MongoDB (dev)...");
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  console.log("🚀 Режим: Production");
  client = new MongoClient(uri);
  console.log("🔌 Підключення до MongoDB (prod)...");
  clientPromise = client.connect();
}

export default clientPromise;
