import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/\/\/.*@/, "//***@") : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
  };

  // Test 1: Basic connection
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    results.ping = "OK";
  } catch (e: any) {
    results.ping = "FAILED: " + e.message;
  }

  // Test 2: Check replica set
  try {
    const rsStatus = await prisma.$runCommandRaw({ replSetGetStatus: 1 });
    results.replicaSet = "OK";
    results.rsDetails = { set: (rsStatus as any).set, ok: (rsStatus as any).ok };
  } catch (e: any) {
    results.replicaSet = "FAILED: " + e.message;
  }

  // Test 3: Count collections
  try {
    const [users, kelas, siswa, absensi] = await Promise.all([
      prisma.user.count(),
      prisma.kelas.count(),
      prisma.siswa.count(),
      prisma.absensi.count(),
    ]);
    results.data = { users, kelas, siswa, absensi };
  } catch (e: any) {
    results.data = "FAILED: " + e.message;
  }

  return NextResponse.json(results, { status: 200 });
}
