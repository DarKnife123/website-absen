"use client"

import StreakBadge from "@/components/dashboard/streak-badge"
import {
  IoPersonCircleOutline,
  IoMailOutline,
  IoCardOutline,
  IoSchoolOutline,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoMedkitOutline,
  IoCloseCircleOutline,
} from "react-icons/io5"

type Props = {
  user: {
    name: string
    email: string
    nis: string
    kelas: string
    image: string | null
  }
  stats: {
    hadir: number
    izin: number
    sakit: number
    alpha: number
  }
  streak: {
    consecutivePresent: number
    consecutiveMissed: number
  }
}

export default function StudentHomeClient({ user, stats, streak }: Props) {
  const statCards = [
    {
      title: "Hadir",
      value: stats.hadir,
      icon: IoCheckmarkCircleOutline,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: "Izin",
      value: stats.izin,
      icon: IoDocumentTextOutline,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Sakit",
      value: stats.sakit,
      icon: IoMedkitOutline,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "Alpha",
      value: stats.alpha,
      icon: IoCloseCircleOutline,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900">
          Halo, <span className="gradient-text">{user.name}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Selamat datang di dashboard absensi kamu.</p>
      </div>

      {/* Streak / Strike Badge */}
      <StreakBadge
        consecutivePresent={streak.consecutivePresent}
        consecutiveMissed={streak.consecutiveMissed}
      />

      {/* Profile Card */}
      <div className="animate-fade-in-up stagger-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">Siswa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <IoMailOutline size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm text-gray-700">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <IoCardOutline size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">NIS</p>
                <p className="text-sm text-gray-700 font-mono">{user.nis}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <IoSchoolOutline size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Kelas</p>
                <p className="text-sm text-gray-700">{user.kelas}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <IoPersonCircleOutline size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Role</p>
                <p className="text-sm text-gray-700">Siswa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 animate-fade-in-up stagger-2">
          Rekap Bulan Ini
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div
              key={card.title}
              className={`animate-fade-in-up stagger-${i + 2} card-hover ${card.bg} border ${card.border} rounded-2xl p-5`}
            >
              <div className="flex items-center justify-between">
                <card.icon size={22} className={card.color} />
                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              </div>
              <p className={`text-sm font-medium mt-2 ${card.color}`}>{card.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
