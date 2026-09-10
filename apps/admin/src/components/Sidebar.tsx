"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/(dashboard)", label: "Dashboard", icon: "📊" },
  { href: "/(dashboard)/documents", label: "Documentos", icon: "📄" },
  { href: "/(dashboard)/categories", label: "Categorías", icon: "📁" },
  { href: "/(dashboard)/pva", label: "PVA", icon: "📖" },
  { href: "/(dashboard)/bible", label: "Biblia", icon: "✝️" },
  { href: "/(dashboard)/notifications", label: "Notificaciones", icon: "🔔" },
  { href: "/(dashboard)/settings", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SC</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Admin</h2>
            <p className="text-xs text-gray-500">Salesianos Cooperadores</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition w-full"
        >
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
