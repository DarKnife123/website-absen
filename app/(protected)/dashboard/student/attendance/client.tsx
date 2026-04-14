"use client"

import { useState, useTransition } from "react"
import { markAttendance } from "@/lib/actions"
import { format } from "date-fns"
import {
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoCloudUploadOutline,
} from "react-icons/io5"

type Props = {
  sudahAbsen: boolean
  todayStatus: string | null
  history: {
    id: string
    tanggal: string
    status: string
    keterangan: string | null
    filePath: string | null
  }[]
}

export default function AttendanceClient({ sudahAbsen, todayStatus, history }: Props) {
  const [isPending, startTransition] = useTransition()
  const [hasAttended, setHasAttended] = useState(sudahAbsen)
  const [currentStatus, setCurrentStatus] = useState(todayStatus)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formStatus, setFormStatus] = useState<"hadir" | "izin" | "sakit">("hadir")
  const [keterangan, setKeterangan] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleAbsen = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      let finalFilePath = ""
      
      // Upload file first if it exists and status is izin/sakit
      if (file && formStatus !== "hadir") {
        setUploading(true)
        const uploadData = new FormData()
        uploadData.append("file", file)
        
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: uploadData,
          })
          const result = await res.json()
          if (result.success) {
            finalFilePath = result.filePath
          }
        } catch (err) {
          console.error("Upload failed", err)
          setMessage({ type: "error", text: "Gagal mengunggah file. Silakan coba lagi." })
          setUploading(false)
          return // Stop execution if upload fails
        }
        setUploading(false)
      }

      // Submit attendance
      const formData = new FormData()
      formData.append("status", formStatus)
      if (keterangan) formData.append("keterangan", keterangan)
      if (finalFilePath) formData.append("filePath", finalFilePath)

      const result = await markAttendance(null, formData)
      
      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else {
        setMessage({ type: "success", text: result.success || "Berhasil absen!" })
        setHasAttended(true)
        setCurrentStatus(formStatus)
      }
      setTimeout(() => setMessage(null), 4000)
    })
  }

  const now = new Date()
  const isWeekend = now.getDay() === 0 || now.getDay() === 6

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="gradient-text">Absensi</span>
        </h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <IoCalendarOutline size={18} />
          {format(now, "EEEE, dd MMMM yyyy")}
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

      {/* Attendance Form Form */}
      <div className="animate-fade-in-up stagger-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <IoTimeOutline size={22} className="text-primary-500" />
          Absensi Hari Ini
        </h2>

        {isWeekend ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏖️</div>
            <h3 className="text-xl font-bold text-gray-700">Hari Libur!</h3>
            <p className="text-gray-500 mt-2">
              Tidak ada absensi pada hari Sabtu/Minggu.
            </p>
          </div>
        ) : hasAttended ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <IoCheckmarkCircleOutline size={40} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-emerald-700">
              Kamu sudah mencatat kehadiran hari ini!
            </h3>
            <p className="text-gray-500 mt-2">
              Status: <span className={`badge badge-${currentStatus} ml-1`}>{currentStatus}</span>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Sampai jumpa besok! 👋
            </p>
          </div>
        ) : (
          <form onSubmit={handleAbsen} className="max-w-xl space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Status</label>
              <div className="grid grid-cols-3 gap-3">
                {(["hadir", "izin", "sakit"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormStatus(s)}
                    className={`py-3 rounded-xl border font-medium text-sm capitalize transition-all ${
                      formStatus === s 
                        ? s === "hadir" ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                        : s === "izin" ? "bg-blue-500 text-white border-blue-500 shadow-md"
                        : "bg-amber-500 text-white border-amber-500 shadow-md"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {formStatus !== "hadir" && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <label htmlFor="keterangan" className="block text-sm font-semibold text-gray-700 mb-2">
                    Keterangan (Alasan)
                  </label>
                  <textarea
                    id="keterangan"
                    rows={3}
                    required
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder={`Tuliskan alasan mengapa kamu ${formStatus}...`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Bukti Surat (Opsional)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <IoCloudUploadOutline size={28} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {file ? <span className="font-semibold text-primary-600">{file.name}</span> : <span>Klik untuk upload file</span>}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (Max. 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setFile(e.target.files[0])
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || uploading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25 mt-4"
            >
              {isPending || uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {uploading ? "Mengunggah..." : "Memproses..."}
                </span>
              ) : (
                "Kirim Absensi"
              )}
            </button>
          </form>
        )}
      </div>

      {/* History */}
      <div className="animate-fade-in-up stagger-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Riwayat Absensi
          </h2>
          <p className="text-sm text-gray-500">30 catatan terakhir</p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Belum ada riwayat absensi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50/80">
                  <th>Tanggal</th>
                  <th>Hari</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                  <th>Bukti</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => {
                  const date = new Date(a.tanggal)
                  return (
                    <tr key={a.id}>
                      <td className="text-gray-700">
                        {format(date, "dd MMM yyyy")}
                      </td>
                      <td className="text-gray-600">
                        {format(date, "EEEE")}
                      </td>
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
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
