import { Db } from "mongodb";
import clientPromise from "./mongodb";

let dbInstance: Db;

export async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance;
  
  const client = await clientPromise;
  // If the URI contains a database name (e.g. /Presensi), it will be used automatically
  const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dummy_build";
  const parser = new URL(uri);
  const dbName = parser.pathname.split("/")[1] || "Presensi";
  
  dbInstance = client.db(dbName);
  return dbInstance;
}
