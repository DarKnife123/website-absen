import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getDashboardStats, getAttendanceChartData } from "@/lib/actions"
import AdminHomeClient from "./client"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role !== "Admin") redirect("/dashboard")

  const [stats, chartData] = await Promise.all([
    getDashboardStats(),
    getAttendanceChartData(),
  ])

  return (
    <AdminHomeClient
      stats={stats}
      chartData={chartData}
      userName={session.user.name || "Admin"}
    />
  )
}
