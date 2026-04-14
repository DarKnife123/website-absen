import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AttendanceClient from "./client"

export default async function AdminAttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const attendance = await prisma.absensi.findMany({
    include: {
      siswa: {
        include: {
          user: true,
          kelas: true,
        },
      },
    },
    orderBy: { tanggal: "desc" },
    take: 200,
  })

  const classes = await prisma.kelas.findMany({ orderBy: { nama: "asc" } })

  const serialized = attendance.map((a) => ({
    id: a.id,
    tanggal: a.tanggal.toISOString(),
    status: a.status,
    siswaName: a.siswa.user.name || "-",
    nis: a.siswa.nis,
    kelas: a.siswa.kelas.nama,
    keterangan: a.keterangan || null,
    filePath: a.filePath || null,
  }))

  return (
    <AttendanceClient
      attendance={serialized}
      classes={classes.map((c) => ({ id: c.id, nama: c.nama }))}
    />
  )
}
