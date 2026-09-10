"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BiblePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bible")
      .then((res) => res.json())
      .then((data) => { setBooks(data.data || []); setLoading(false); });
  }, []);

  const oldTestament = books.filter((b) => b.testament === "AT");
  const newTestament = books.filter((b) => b.testament === "NT");

  return (
    <div>
      <Link href="/dashboard" className="text-primary-500 hover:text-primary-700 text-sm mb-4 inline-block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Biblia</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay libros bíblicos aún.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-amber-800">Antiguo Testamento ({oldTestament.length} libros)</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {oldTestament.map((book) => (
                <div key={book.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900">{book.name}</div>
                    <div className="text-sm text-gray-500">{book.abbreviation}</div>
                  </div>
                  <span className="text-sm text-gray-400">{book._count?.chapters || 0} caps</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800">Nuevo Testamento ({newTestament.length} libros)</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {newTestament.map((book) => (
                <div key={book.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900">{book.name}</div>
                    <div className="text-sm text-gray-500">{book.abbreviation}</div>
                  </div>
                  <span className="text-sm text-gray-400">{book._count?.chapters || 0} caps</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
