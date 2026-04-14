import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AttendanceClient from "./client"

export default async function StudentAttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "User") redirect("/dashboard")

  const siswa = await prisma.siswa.findUnique({
    where: { userId: session.user.id },
    include: {
      absensi: {
        orderBy: { tanggal: "desc" },
        take: 30,
      },
    },
  })

  if (!siswa) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Data siswa tidak ditemukan.</p>
      </div>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sudahAbsen = siswa.absensi.some(
    (a) => {
      const tanggal = new Date(a.tanggal)
      tanggal.setHours(0, 0, 0, 0)
      return tanggal.getTime() === today.getTime()
    }
  )

  const todayRecord = siswa.absensi.find((a) => {
    const tanggal = new Date(a.tanggal)
    tanggal.setHours(0, 0, 0, 0)
    return tanggal.getTime() === today.getTime()
  })

  const history = siswa.absensi.map((a) => ({
    id: a.id,
    tanggal: a.tanggal.toISOString(),
    status: a.status,
    keterangan: a.keterangan,
    filePath: a.filePath,
  }))

  return (
    <AttendanceClient
      sudahAbsen={sudahAbsen}
      todayStatus={todayRecord?.status || null}
      history={history}
    />
  )
}
