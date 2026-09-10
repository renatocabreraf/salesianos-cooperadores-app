"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PvaPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pva")
      .then((res) => res.json())
      .then((data) => { setSections(data.data || []); setLoading(false); });
  }, []);

  const groupedByChapter = sections.reduce((acc: any, section: any) => {
    const chapter = section.chapter || 1;
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(section);
    return acc;
  }, {});

  return (
    <div>
      <Link href="/dashboard" className="text-primary-500 hover:text-primary-700 text-sm mb-4 inline-block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">PVA - Proyecto de Vida Apostólica</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : Object.keys(groupedByChapter).length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay artículos del PVA aún.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByChapter).map(([chapter, items]: [string, any]) => (
            <div key={chapter} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                <h2 className="text-lg font-semibold text-green-800">Capítulo {chapter}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((section: any) => (
                  <div key={section.id} className="px-6 py-4">
                    <div className="font-medium text-gray-900">{section.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
