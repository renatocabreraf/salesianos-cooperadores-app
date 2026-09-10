"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalDocuments: number;
  totalCategories: number;
  totalPvaSections: number;
  totalBibleBooks: number;
  totalNotifications: number;
  recentDocuments: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data.data));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Documentos",
      value: stats.totalDocuments,
      icon: "📄",
      href: "/dashboard/documents",
    },
    {
      label: "Categorías",
      value: stats.totalCategories,
      icon: "📁",
      href: "/dashboard/categories",
    },
    {
      label: "PVA (Artículos)",
      value: stats.totalPvaSections,
      icon: "📖",
      href: "/dashboard/pva",
    },
    {
      label: "Libros Bíblicos",
      value: stats.totalBibleBooks,
      icon: "✝️",
      href: "/dashboard/bible",
    },
    {
      label: "Notificaciones",
      value: stats.totalNotifications,
      icon: "🔔",
      href: "/dashboard/notifications",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/documents"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            + Nuevo Documento
          </Link>
          <Link
            href="/dashboard/pva"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Nuevo Artículo PVA
          </Link>
          <Link
            href="/dashboard/notifications"
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            + Enviar Notificación
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Documentos Recientes
        </h2>
        {stats.recentDocuments.length === 0 ? (
          <p className="text-gray-500">No hay documentos aún.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentDocuments.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{doc.title}</div>
                  <div className="text-sm text-gray-500">
                    {doc.category?.name} · {doc.type}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(doc.createdAt).toLocaleDateString("es")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
