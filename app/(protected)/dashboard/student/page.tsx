import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getStreakData } from "@/lib/actions"
import { startOfMonth, endOfMonth } from "date-fns"
import StudentHomeClient from "./client"

export default async function StudentDashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "User") redirect("/dashboard")

  const db = await getDb()
  let userObjId;
  try { userObjId = new ObjectId(session.user.id); } catch(e) { userObjId = session.user.id; }

  const siswaArr = await db.collection("siswa").aggregate([
    { $match: { $or: [{ userId: userObjId }, { userId: session.user.id as any }] } },
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "kelas", localField: "kelasId", foreignField: "_id", as: "kelas" } },
    { $unwind: { path: "$kelas", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "absensi", localField: "_id", foreignField: "siswaId", as: "absensi" } },
  ]).toArray();

  const siswa = siswaArr[0];

  if (!siswa) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Data siswa tidak ditemukan.</p>
        </div>
      </div>
    )
  }

  // Sort absensi by date descending (done in JS since MongoDB 4.4 doesn't support pipeline in $lookup with localField)
  if (siswa.absensi) {
    siswa.absensi.sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
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

  const streak = await getStreakData(siswa._id.toString())

  return (
    <StudentHomeClient
      user={{
        name: siswa.user?.name || "-",
        email: siswa.user?.email || "-",
        nis: siswa.nis,
        kelas: siswa.kelas?.nama || "-",
        image: siswa.user?.image,
      }}
      stats={stats}
      streak={streak}
    />
  )
}
