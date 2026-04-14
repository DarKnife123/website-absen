"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateUser } from "@/lib/actions"
import { IoArrowBackOutline, IoSaveOutline } from "react-icons/io5"
import Link from "next/link"

type Props = {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function EditUserClient({ user }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateUser(user.id, formData)
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: result.success || "Berhasil!" })
        setTimeout(() => router.push("/dashboard/admin/users"), 1500)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-4"
        >
          <IoArrowBackOutline size={16} />
          Kembali ke daftar user
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit <span className="gradient-text">User</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Ubah informasi pengguna.
        </p>
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

      {/* Form */}
      <div className="animate-fade-in-up stagger-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nama
            </label>
            <input
              type="text"
              name="name"
              id="edit-user-name"
              defaultValue={user.name}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="edit-user-email"
              defaultValue={user.email}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Role
            </label>
            <select
              name="role"
              id="edit-user-role"
              defaultValue={user.role}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            >
              <option value="User">User (Siswa)</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25"
              id="save-user-btn"
            >
              <IoSaveOutline size={18} />
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <Link
              href="/dashboard/admin/users"
              className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
