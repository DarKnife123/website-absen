"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { IoSearchOutline, IoFunnelOutline } from "react-icons/io5"

type AttendanceRecord = {
  id: string
  tanggal: string
  status: string
  siswaName: string
  nis: string
  kelas: string
  keterangan: string | null
  filePath: string | null
}

type Props = {
  attendance: AttendanceRecord[]
  classes: { id: string; nama: string }[]
}

export default function AttendanceClient({ attendance, classes }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kelasFilter, setKelasFilter] = useState("all")

  const filtered = attendance.filter((a) => {
    const matchSearch =
      a.siswaName.toLowerCase().includes(search.toLowerCase()) ||
      a.nis.includes(search)
    const matchStatus = statusFilter === "all" || a.status === statusFilter
    const matchKelas = kelasFilter === "all" || a.kelas === kelasFilter
    return matchSearch && matchStatus && matchKelas
  })

  const statusCounts = {
    all: attendance.length,
    hadir: attendance.filter((a) => a.status === "hadir").length,
    izin: attendance.filter((a) => a.status === "izin").length,
    sakit: attendance.filter((a) => a.status === "sakit").length,
    alpha: attendance.filter((a) => a.status === "alpha").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900">
          Data <span className="gradient-text">Absensi</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Lihat semua data kehadiran siswa.
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="animate-fade-in-up stagger-1 flex flex-wrap gap-2">
        {(["all", "hadir", "izin", "sakit", "alpha"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? status === "all"
                  ? "bg-gray-900 text-white"
                  : status === "hadir"
                  ? "bg-emerald-500 text-white"
                  : status === "izin"
                  ? "bg-blue-500 text-white"
                  : status === "sakit"
                  ? "bg-amber-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
            id={`filter-${status}`}
          >
            {status === "all" ? "Semua" : status.charAt(0).toUpperCase() + status.slice(1)}{" "}
            <span className="ml-1 opacity-80">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Search & Kelas filter */}
      <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <IoSearchOutline
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau NIS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            id="search-attendance"
          />
        </div>
        <div className="relative">
          <IoFunnelOutline
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
            className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            id="filter-kelas"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.nama}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in-up stagger-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="bg-gray-50/80">
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Siswa</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Keterangan</th>
                <th>Bukti</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    Tidak ada data absensi ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((a, i) => (
                  <tr key={a.id}>
                    <td className="font-medium text-gray-500">{i + 1}</td>
                    <td className="text-gray-700">
                      {format(new Date(a.tanggal), "dd MMM yyyy")}
                    </td>
                    <td className="font-semibold text-gray-900">{a.siswaName}</td>
                    <td className="text-gray-600 font-mono text-xs">{a.nis}</td>
                    <td className="text-gray-600">{a.kelas}</td>
                    <td>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </td>
                    <td className="text-gray-600 text-sm max-w-xs truncate" title={a.keterangan || ""}>
                       {a.keterangan || "-"}
                    </td>
                    <td>
                      {a.filePath ? (
                         <a href={a.filePath} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-xs flex items-center gap-1 font-medium">
                            Lihat File
                         </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> dari{" "}
            <span className="font-semibold text-gray-700">{attendance.length}</span> catatan
          </p>
        </div>
      </div>
    </div>
  )
}
