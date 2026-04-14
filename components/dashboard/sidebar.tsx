"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHomeOutline,
  IoPeopleOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkCircleOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useState } from "react";

type SidebarProps = {
  role: string;
  userName: string;
  userEmail: string;
};

const adminLinks = [
  { href: "/dashboard/admin", label: "Home", icon: IoHomeOutline },
  { href: "/dashboard/admin/users", label: "Manajemen User", icon: IoPeopleOutline },
  { href: "/dashboard/admin/attendance", label: "Data Absensi", icon: IoCalendarOutline },
];

const studentLinks = [
  { href: "/dashboard/student", label: "Home", icon: IoHomeOutline },
  { href: "/dashboard/student/attendance", label: "Absensi", icon: IoCheckmarkCircleOutline },
];

export default function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = role === "Admin" ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar-bg text-white p-2 rounded-lg shadow-lg"
        id="sidebar-mobile-toggle"
      >
        <IoMenuOutline size={24} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-sidebar-bg z-50
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Absensi</h2>
              <p className="text-sidebar-text text-xs">Sistem Kehadiran</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-sidebar-text hover:text-white"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 custom-scrollbar overflow-y-auto">
          <p className="text-sidebar-text text-xs font-semibold uppercase tracking-wider px-3 mb-3">
            {role === "Admin" ? "Admin Menu" : "Student Menu"}
          </p>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  sidebar-link flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                  ${
                    isActive
                      ? "bg-primary-600/20 text-white active"
                      : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
                  }
                `}
              >
                <link.icon
                  size={20}
                  className={isActive ? "text-primary-400" : ""}
                />
                {link.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <IoPersonOutline size={18} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{userName}</p>
              <p className="text-sidebar-text text-xs truncate">{userEmail}</p>
            </div>
          </div>
          <form
            action="/api/auth/signout"
            method="POST"
          >
            <button
              type="button"
              onClick={async () => {
                const { signOut } = await import("next-auth/react");
                signOut({ callbackUrl: "/login" });
              }}
              className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-text hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <IoLogOutOutline size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
