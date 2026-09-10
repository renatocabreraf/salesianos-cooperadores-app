"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este documento?")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments(documents.filter((d) => d.id !== id));
  };

  return (
    <div>
      <Link href="/dashboard" className="text-primary-500 hover:text-primary-700 text-sm mb-4 inline-block">
        ← Volver al Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
        <Link href="/dashboard/documents/new"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">
          + Nuevo Documento
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay documentos. Crea el primero.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Título</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tipo</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/dashboard/documents/${doc.id}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${doc.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {doc.isPublished ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="text-red-500 hover:text-red-700 text-sm">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
