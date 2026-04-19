import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ message: "Database already has data. Skipping seed.", count: existingUsers });
    }

    // Seed Kelas
    await prisma.kelas.createMany({
      data: [
        { id: "xii-sija-b", nama: "XII SIJA B" },
        { id: "xii-sija-a", nama: "XII SIJA A" },
      ],
    });

    // Seed Users
    const usersData = [
      {
        id: "cmnf92fxq0000y0veyermedjm",
        name: "Rakha Oktav Farras Naufal",
        email: "rakhaoktav@gmail.com",
        password: "$2b$10$bmBZNbO7wcIiULCR6hqo/eQDesNL.ye3dq0IQ8ExQqFhFxYuWdgSu",
        role: "User" as const,
      },
      {
        id: "cmnpbv4hg0001bcve93z7xkpa",
        name: "Admin",
        email: "admin@gmail.com",
        password: "$2b$10$StzO3wa9O7pIC/sX1aJfIO3MrqoFIHthA.GX1aFolM6luo1MhbKPq",
        role: "Admin" as const,
      },
      {
        id: "cmnpgtxqe0000m4veyxuoqxf3",
        name: "Faris Hawari",
        email: "farishawari@gmail.com",
        password: "$2b$10$oPUlo8W20e038iKPCxZAdeV/fSsOc/ucCfr53gEOUjJ1oJlGFKfEm",
        role: "User" as const,
      },
      {
        id: "cmnph7oo00003m4vewzce9bmn",
        name: "Novan Harvian",
        email: "novanharvian@gmail.com",
        password: "$2b$10$KOTZX2Ed/1LKrtw0J3myRehiLOJ1zx2JB05NlRgXtUxw./4J/3tWm",
        role: "User" as const,
      },
      {
        id: "cmnph8wlj0005m4vefz8iqund",
        name: "Rio Malik Rozan",
        email: "riorioin@gmail.com",
        password: "$2b$10$PNnqkLv1C2HuuolAOmMuk.ARL/jaI2ZrGqciC/obIeVJgRJaF9pvi",
        role: "User" as const,
      },
      {
        id: "cmnphl72f0009m4veep678ym6",
        name: "Muhammad Adam Fauzul Amni",
        email: "adam@gmail.com",
        password: "$2b$10$8vCreT/AKvNiJaan5FVEk.gb7D/YdohACKnMpucFZBjSxEZrAeDt6",
        role: "User" as const,
      },
    ];

    for (const user of usersData) {
      await prisma.user.create({ data: user });
    }

    // Seed Siswa
    const siswaData = [
      { id: "cmnpbv4j90002bcveg0si7qgj", nis: "ae6d530f", userId: "cmnpbv4hg0001bcve93z7xkpa", kelasId: "xii-sija-b" },
      { id: "cmnpgtxrq0001m4ve03mzn7yw", nis: "231117099", userId: "cmnpgtxqe0000m4veyxuoqxf3", kelasId: "xii-sija-b" },
      { id: "cmnf92g7s0001y0veipo6okeg", nis: "231117117", userId: "cmnf92fxq0000y0veyermedjm", kelasId: "xii-sija-b" },
      { id: "cmnph7oqk0004m4veep2vezjj", nis: "231117115", userId: "cmnph7oo00003m4vewzce9bmn", kelasId: "xii-sija-b" },
      { id: "cmnph8wnu0006m4vegb2x2b8s", nis: "231117119", userId: "cmnph8wlj0005m4vefz8iqund", kelasId: "xii-sija-b" },
      { id: "cmnphl74g000am4ve3xtwpn2s", nis: "23117105", userId: "cmnphl72f0009m4veep678ym6", kelasId: "xii-sija-b" },
    ];

    for (const siswa of siswaData) {
      await prisma.siswa.create({ data: siswa });
    }

    // Seed Absensi
    const absensiData = [
      {
        id: "cmnpbfhk00000bcvewzgsxem4",
        tanggal: new Date("2026-04-08T00:34:16.587Z"),
        status: "hadir" as const,
        siswaId: "cmnf92g7s0001y0veipo6okeg",
        keterangan: null,
        filePath: null,
      },
      {
        id: "cmnpgwwgf0002m4vee4i6b641",
        tanggal: new Date("2026-04-08T03:07:47.145Z"),
        status: "izin" as const,
        siswaId: "cmnpgtxrq0001m4ve03mzn7yw",
        keterangan: "Males sekolah ah, tugas numpuk.",
        filePath: "/uploads/1775617666290-198756850-10.png",
      },
      {
        id: "cmnph9c5v0007m4ve6a1a7jhp",
        tanggal: new Date("2026-04-08T03:17:27.377Z"),
        status: "hadir" as const,
        siswaId: "cmnph7oqk0004m4veep2vezjj",
        keterangan: null,
        filePath: null,
      },
      {
        id: "cmnpha17d0008m4vemei72jx2",
        tanggal: new Date("2026-04-08T03:17:59.832Z"),
        status: "sakit" as const,
        siswaId: "cmnph8wnu0006m4vegb2x2b8s",
        keterangan: "Sakit hati bu",
        filePath: "/uploads/1775618279225-411699347-11.png",
      },
    ];

    for (const absensi of absensiData) {
      await prisma.absensi.create({ data: absensi });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        users: usersData.length,
        kelas: 2,
        siswa: siswaData.length,
        absensi: absensiData.length,
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
