"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => { setCategories(data.data || []); setLoading(false); });
  }, []);

  const renderCategory = (cat: any, depth: number = 0) => (
    <div key={cat.id} style={{ marginLeft: depth * 24 }}>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
        <span className="text-lg">{cat.icon || "📁"}</span>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{cat.name}</div>
          <div className="text-sm text-gray-500">{cat.slug}</div>
        </div>
        <span className="text-sm text-gray-400">{cat._count?.documents || 0} docs</span>
      </div>
      {cat.children?.map((child: any) => renderCategory(child, depth + 1))}
    </div>
  );

  return (
    <div>
      <Link href="/dashboard" className="text-primary-500 hover:text-primary-700 text-sm mb-4 inline-block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Categorías</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {categories.map((cat) => renderCategory(cat))}
        </div>
      )}
    </div>
  );
}
