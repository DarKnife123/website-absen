import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getStreakData } from "@/lib/actions"
import { startOfMonth, endOfMonth } from "date-fns"
import StudentHomeClient from "./client"

export default async function StudentDashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "User") redirect("/dashboard")

  const siswa = await prisma.siswa.findUnique({
    where: { userId: session.user.id },
    include: {
      kelas: true,
      absensi: {
        orderBy: { tanggal: "desc" },
      },
      user: true,
    },
  })

  if (!siswa) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Data siswa tidak ditemukan.</p>
        </div>
      </div>
    )
  }

  const now = new Date()
  const awalBulan = startOfMonth(now)
  const akhirBulan = endOfMonth(now)

  const absensiBulanIni = siswa.absensi.filter(
    (a: any) => a.tanggal >= awalBulan && a.tanggal <= akhirBulan
  )

  const stats = {
    hadir: absensiBulanIni.filter((a: any) => a.status === "hadir").length,
    izin: absensiBulanIni.filter((a: any) => a.status === "izin").length,
    sakit: absensiBulanIni.filter((a: any) => a.status === "sakit").length,
    alpha: absensiBulanIni.filter((a: any) => a.status === "alpha").length,
  }

  const streak = await getStreakData(siswa.id)

  return (
    <StudentHomeClient
      user={{
        name: siswa.user.name || "-",
        email: siswa.user.email || "-",
        nis: siswa.nis,
        kelas: siswa.kelas.nama,
        image: siswa.user.image,
      }}
      stats={stats}
      streak={streak}
    />
  )
}
