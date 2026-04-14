import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import UsersClient from "./client"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const users = await prisma.user.findMany({
    include: {
      siswa: {
        include: {
          kelas: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  const serializedUsers = users.map((u) => ({
    id: u.id,
    name: u.name || "-",
    email: u.email || "-",
    role: u.role,
    nis: u.siswa?.nis || null,
    kelas: u.siswa?.kelas?.nama || null,
    currentUserId: session.user.id,
  }))

  return <UsersClient users={serializedUsers} />
}
