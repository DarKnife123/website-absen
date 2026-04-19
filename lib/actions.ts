"use server";

import { RegisterSchema, SignInSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

// ==================== AUTH ACTIONS ====================

export const SignUpCredentials = async (prevState: unknown, formData: FormData) => {
  const validateFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, nis, kelasId } = validateFields.data;
  const hashedPassword = hashSync(password, 10);

  // Check if class exists
  const kelas = await prisma.kelas.findUnique({ where: { id: kelasId } });
  if (!kelas) {
    return { message: "Kelas tidak ditemukan." };
  }

  // Check if NIS is already taken
  const existingNis = await prisma.siswa.findUnique({ where: { nis } });
  if (existingNis) {
    return { error: { nis: ["NIS sudah terdaftar."] } };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "User",
        siswa: {
          create: {
            nis,
            kelasId,
          },
        },
      },
    });
  } catch (error) {
    return { message: "Failed to register user" };
  }
  redirect("/login");
};

export const SignInCredentials = async (prevState: unknown, formData: FormData) => {
  const validateFields = SignInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validateFields.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid email or password" };
        default:
          return { message: "Something went wrong" };
      }
    }
    throw error;
  }
};

// ==================== ATTENDANCE ACTIONS ====================

export async function markAttendance(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "User") {
    return { error: "Unauthorized" };
  }

  const siswa = await prisma.siswa.findUnique({
    where: { userId: session.user.id },
  });

  if (!siswa) {
    return { error: "Data siswa tidak ditemukan" };
  }

  const status = formData.get("status") as "hadir" | "izin" | "sakit";
  const keterangan = formData.get("keterangan") as string;
  const filePath = formData.get("filePath") as string;

  if (!["hadir", "izin", "sakit"].includes(status)) {
     return { error: "Status tidak valid" };
  }

  // Check if already attended today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingAttendance = await prisma.absensi.findFirst({
    where: {
      siswaId: siswa.id,
      tanggal: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (existingAttendance) {
    return { error: "Kamu sudah absen hari ini" };
  }

  try {
      await prisma.absensi.create({
        data: {
            tanggal: new Date(),
            status,
            siswaId: siswa.id,
            keterangan: keterangan || null,
            filePath: filePath || null,
        },
      });

      revalidatePath("/dashboard/student");
      revalidatePath("/dashboard/student/attendance");
      return { success: "Berhasil absen hari ini!" };
  } catch (err: any) {
      console.error(err);
      return { error: "Gagal menyimpan absensi: " + String(err?.message || err) };
  }
}

// ... existing code needs file upload API endpoint, but we can do that in NextJS route.

// ==================== USER MANAGEMENT (ADMIN) ====================

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session || session.user.role !== "Admin") {
    return { error: "Unauthorized" };
  }

  if (userId === session.user.id) {
    return { error: "Tidak dapat menghapus akun sendiri" };
  }

  try {
    // Delete absensi first to prevent foreign key errors
    const siswa = await prisma.siswa.findMany({ where: { userId } });
    for (const s of siswa) {
       await prisma.absensi.deleteMany({ where: { siswaId: s.id }});
    }

    // Delete siswa record
    await prisma.siswa.deleteMany({
      where: { userId },
    });

    await prisma.account.deleteMany({
      where: { userId },
    });

    await prisma.session.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: "User berhasil dihapus" };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return { error: "Gagal menghapus user: " + String(error?.message || error) };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "Admin") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !role) {
    return { error: "Semua field harus diisi" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email, role: role as any },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: "User berhasil diupdate" };
  } catch (error) {
    return { error: "Gagal mengupdate user" };
  }
}

// ==================== DATA FETCHING ====================

export async function getAttendanceChartData() {
  const session = await auth();
  if (!session || session.user.role !== "Admin") {
    return [];
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const attendance = await prisma.absensi.findMany({
    where: {
      tanggal: { gte: sixMonthsAgo },
    },
    orderBy: { tanggal: "asc" },
  });

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  const grouped: Record<string, { hadir: number; izin: number; sakit: number; alpha: number }> = {};

  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    grouped[key] = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
  }

  attendance.forEach((a: any) => {
    const key = `${monthNames[a.tanggal.getMonth()]} ${a.tanggal.getFullYear()}`;
    if (grouped[key]) {
      (grouped[key] as any)[a.status]++;
    }
  });

  return Object.entries(grouped).map(([label, data]) => ({
    label,
    ...data,
  }));
}

export async function getStreakData(siswaId: string) {
  const absensi = await prisma.absensi.findMany({
    where: { siswaId },
    orderBy: { tanggal: "desc" },
  });

  if (absensi.length === 0) {
    return { consecutivePresent: 0, consecutiveMissed: 0 };
  }

  // Get all weekdays from the most recent attendance record going back
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a set of dates when student was present
  const presentDates = new Set<string>();
  absensi.forEach((a: any) => {
    if (a.status === "hadir") {
      const d = new Date(a.tanggal);
      d.setHours(0, 0, 0, 0);
      presentDates.add(d.toISOString());
    }
  });

  // Build set of all attendance dates (any status)
  const allDates = new Set<string>();
  absensi.forEach((a: any) => {
    const d = new Date(a.tanggal);
    d.setHours(0, 0, 0, 0);
    allDates.add(d.toISOString());
  });

  // Check consecutive present days going backward from today
  let consecutivePresent = 0;
  let checkDate = new Date(today);

  // If today is weekend, go to Friday
  while (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    // Skip weekends
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    }

    const dateStr = new Date(checkDate).toISOString();
    if (presentDates.has(dateStr)) {
      consecutivePresent++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Check consecutive missed days (no record at all on weekdays)
  let consecutiveMissed = 0;
  checkDate = new Date(today);

  // If today is weekend, go to Friday
  while (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    }

    const dateStr = new Date(checkDate).toISOString();
    if (!allDates.has(dateStr)) {
      consecutiveMissed++;
      checkDate.setDate(checkDate.getDate() - 1);
      // Limit to checking 30 days back
      if (consecutiveMissed > 30) break;
    } else {
      break;
    }
  }

  return { consecutivePresent, consecutiveMissed };
}

export async function getDashboardStats() {
  const session = await auth();
  if (!session || session.user.role !== "Admin") {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalStudents, totalClasses, todayAttendance, totalUsers] = await Promise.all([
    prisma.siswa.count(),
    prisma.kelas.count(),
    prisma.absensi.count({
      where: {
        tanggal: { gte: today, lt: tomorrow },
      },
    }),
    prisma.user.count(),
  ]);

  return {
    totalStudents,
    totalClasses,
    todayAttendance,
    totalUsers,
  };
}