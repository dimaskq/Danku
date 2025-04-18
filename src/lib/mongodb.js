import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://dmtrokravchenko:Z0qCjcIMPrVPIQd2@danku.yogvqha.mongodb.net/?retryWrites=true&w=majority&appName=Danku";
let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db("danku");
}
