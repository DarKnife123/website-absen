import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import UsersClient from "./client"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const db = await getDb()
  const users = await db.collection("users").aggregate([
    { $sort: { name: 1 } },
    { $lookup: { from: "siswa", localField: "_id", foreignField: "userId", as: "siswa" } },
    { $unwind: { path: "$siswa", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "kelas", localField: "siswa.kelasId", foreignField: "_id", as: "siswa.kelas" } },
    { $unwind: { path: "$siswa.kelas", preserveNullAndEmptyArrays: true } },
  ]).toArray()

  const serializedUsers = users.map((u: any) => ({
    id: u._id.toString(),
    name: u.name || "-",
    email: u.email || "-",
    role: u.role,
    nis: u.siswa?.nis || null,
    kelas: u.siswa?.kelas?.nama || null,
    currentUserId: session.user.id,
  }))

  return <UsersClient users={serializedUsers} />
}
