"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => { setNotifications(data.data || []); setLoading(false); });
  }, []);

  return (
    <div>
      <Link href="/dashboard" className="text-primary-500 hover:text-primary-700 text-sm mb-4 inline-block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Notificaciones</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay notificaciones.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <div key={notif.id} className="px-6 py-4">
                <div className="font-medium text-gray-900">{notif.title}</div>
                <div className="text-sm text-gray-500">{notif.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
