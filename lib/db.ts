import { Db } from "mongodb";
import clientPromise from "./mongodb";

let dbInstance: Db;

export async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance;
  
  const client = await clientPromise;
  // If the URI contains a database name (e.g. /Presensi), it will be used automatically
  const parser = new URL(process.env.DATABASE_URL!);
  const dbName = parser.pathname.split("/")[1] || "Presensi";
  
  dbInstance = client.db(dbName);
  return dbInstance;
}
