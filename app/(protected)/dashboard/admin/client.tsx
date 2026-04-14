"use client"

import AttendanceChart from "@/components/dashboard/attendance-chart"
import { IoPersonOutline, IoSchoolOutline, IoCalendarOutline, IoPeopleOutline } from "react-icons/io5"

type Stats = {
  totalStudents: number
  totalClasses: number
  todayAttendance: number
  totalUsers: number
} | null

type ChartData = {
  label: string
  hadir: number
  izin: number
  sakit: number
  alpha: number
}[]

type Props = {
  stats: Stats
  chartData: ChartData
  userName: string
}

export default function AdminHomeClient({ stats, chartData, userName }: Props) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: IoPeopleOutline,
      color: "from-primary-500 to-primary-700",
      bgLight: "bg-primary-50",
    },
    {
      title: "Total Siswa",
      value: stats?.totalStudents ?? 0,
      icon: IoPersonOutline,
      color: "from-emerald-500 to-emerald-700",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Total Kelas",
      value: stats?.totalClasses ?? 0,
      icon: IoSchoolOutline,
      color: "from-amber-500 to-amber-700",
      bgLight: "bg-amber-50",
    },
    {
      title: "Absensi Hari Ini",
      value: stats?.todayAttendance ?? 0,
      icon: IoCalendarOutline,
      color: "from-rose-500 to-rose-700",
      bgLight: "bg-rose-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang, <span className="gradient-text">{userName}</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Berikut ringkasan data absensi siswa hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={card.title}
            className={`animate-fade-in-up stagger-${i + 1} card-hover bg-white rounded-2xl p-6 shadow-sm border border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 animate-count-up">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgLight} p-3 rounded-xl`}>
                <card.icon size={24} className="text-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="animate-fade-in-up stagger-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Grafik Absensi Bulanan
            </h2>
            <p className="text-sm text-gray-500">6 bulan terakhir</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Hadir", color: "bg-emerald-500" },
              { label: "Izin", color: "bg-blue-500" },
              { label: "Sakit", color: "bg-amber-500" },
              { label: "Alpha", color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <AttendanceChart data={chartData} />
      </div>
    </div>
  )
}
