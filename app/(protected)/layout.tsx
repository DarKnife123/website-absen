import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import Sidebar from "@/components/dashboard/sidebar"

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const session = await auth()

  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-dashboard-bg">
      <Sidebar
        role={session.user.role}
        userName={session.user.name || "User"}
        userEmail={session.user.email || ""}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}