"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteUser } from "@/lib/actions"
import { IoSearchOutline, IoTrashOutline, IoPencilOutline, IoPersonAddOutline } from "react-icons/io5"

type User = {
  id: string
  name: string
  email: string
  role: string
  nis: string | null
  kelas: string | null
  currentUserId: string
}

type Props = {
  users: User[]
}

export default function UsersClient({ users }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.nis && u.nis.includes(search))
  )

  const handleDelete = (userId: string, userName: string) => {
    if (!confirm(`Yakin ingin menghapus user "${userName}"?`)) return

    setDeletingId(userId)
    startTransition(async () => {
      const result = await deleteUser(userId)
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: result.success || "Berhasil!" })
        router.refresh()
      }
      setDeletingId(null)
      setTimeout(() => setMessage(null), 3000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen <span className="gradient-text">User</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola semua pengguna sistem absensi.
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`animate-fade-in-up p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="animate-fade-in-up stagger-1">
        <div className="relative max-w-md">
          <IoSearchOutline
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari nama, email, atau NIS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            id="search-users"
          />
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in-up stagger-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="bg-gray-50/80">
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {search ? "Tidak ditemukan user yang cocok." : "Belum ada data user."}
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <tr key={user.id}>
                    <td className="font-medium text-gray-500">{i + 1}</td>
                    <td className="font-semibold text-gray-900">{user.name}</td>
                    <td className="text-gray-600">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === "Admin" ? "badge-admin" : "badge-user"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-gray-600 font-mono text-xs">{user.nis || "-"}</td>
                    <td className="text-gray-600">{user.kelas || "-"}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/users/edit/${user.id}`}
                          className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <IoPencilOutline size={16} />
                        </Link>
                        {user.id !== user.currentUserId && (
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={isPending && deletingId === user.id}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Hapus"
                            id={`delete-user-${user.id}`}
                          >
                            {isPending && deletingId === user.id ? (
                              <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin inline-block" />
                            ) : (
                              <IoTrashOutline size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> dari{" "}
            <span className="font-semibold text-gray-700">{users.length}</span> user
          </p>
        </div>
      </div>
    </div>
  )
}
