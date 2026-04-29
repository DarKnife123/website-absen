import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import AttendanceClient from "./client"

export default async function AdminAttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const db = await getDb()
  const attendance = await db.collection("absensi").aggregate([
    { $sort: { tanggal: -1 } },
    { $limit: 200 },
    { $lookup: { from: "siswa", localField: "siswaId", foreignField: "_id", as: "siswa" } },
    { $unwind: { path: "$siswa", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "users", localField: "siswa.userId", foreignField: "_id", as: "siswa.user" } },
    { $unwind: { path: "$siswa.user", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "kelas", localField: "siswa.kelasId", foreignField: "_id", as: "siswa.kelas" } },
    { $unwind: { path: "$siswa.kelas", preserveNullAndEmptyArrays: true } },
  ]).toArray()

  const classes = await db.collection("kelas").find().sort({ nama: 1 }).toArray()

  const serialized = attendance.map((a: any) => ({
    id: a._id.toString(),
    tanggal: a.tanggal.toISOString(),
    status: a.status,
    siswaName: a.siswa?.user?.name || "-",
    nis: a.siswa?.nis || "-",
    kelas: a.siswa?.kelas?.nama || "-",
    keterangan: a.keterangan || null,
    filePath: a.filePath || null,
  }))

  return (
    <AttendanceClient
      attendance={serialized}
      classes={classes.map((c: any) => ({ id: c._id.toString(), nama: c.nama }))}
    />
  )
}
