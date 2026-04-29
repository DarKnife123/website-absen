import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import EditUserClient from "./client"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: Props) {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const { id } = await params

  const db = await getDb()
  let userObjId;
  try { userObjId = new ObjectId(id); } catch(e) { userObjId = id; }
  
  const user = await db.collection("users").findOne({
    $or: [{_id: userObjId}, {_id: id as any}]
  })

  if (!user) {
    redirect("/dashboard/admin/users")
  }

  return (
    <EditUserClient
      user={{
        id: user._id.toString(),
        name: user.name || "",
        email: user.email || "",
        role: user.role,
      }}
    />
  )
}
