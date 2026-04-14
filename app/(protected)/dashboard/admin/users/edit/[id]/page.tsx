import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditUserClient from "./client"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: Props) {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    redirect("/dashboard/admin/users")
  }

  return (
    <EditUserClient
      user={{
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        role: user.role,
      }}
    />
  )
}
