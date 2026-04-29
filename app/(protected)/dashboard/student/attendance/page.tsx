import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import AttendanceClient from "./client"

export default async function StudentAttendancePage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "User") redirect("/dashboard")

  const db = await getDb()
  let userObjId;
  try { userObjId = new ObjectId(session.user.id); } catch(e) { userObjId = session.user.id; }

  const siswaArr = await db.collection("siswa").aggregate([
    { $match: { $or: [{ userId: userObjId }, { userId: session.user.id as any }] } },
    { $lookup: { from: "absensi", localField: "_id", foreignField: "siswaId", pipeline: [ { $sort: { tanggal: -1 } }, { $limit: 30 } ], as: "absensi" } },
  ]).toArray();

  const siswa = siswaArr[0];

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
    (a: any) => {
      const tanggal = new Date(a.tanggal)
      tanggal.setHours(0, 0, 0, 0)
      return tanggal.getTime() === today.getTime()
    }
  )

  const todayRecord = siswa.absensi.find((a: any) => {
    const tanggal = new Date(a.tanggal)
    tanggal.setHours(0, 0, 0, 0)
    return tanggal.getTime() === today.getTime()
  })

  const history = siswa.absensi.map((a: any) => ({
    id: a._id?.toString(),
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
