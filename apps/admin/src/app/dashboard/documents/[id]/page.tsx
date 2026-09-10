"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    type: "mensaje",
    categoryId: "",
    author: "",
    authorRole: "",
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((res) => res.json()),
      fetch(`/api/documents/${params.id}`).then((res) => res.json()),
    ]).then(([catsData, docData]) => {
      setCategories(catsData.data || []);
      if (docData.data) {
        const doc = docData.data;
        setForm({
          title: doc.title || "",
          description: doc.description || "",
          content: doc.content || "",
          type: doc.type || "mensaje",
          categoryId: doc.categoryId || "",
          author: doc.author || "",
          authorRole: doc.authorRole || "",
          isPublished: doc.isPublished || false,
          isFeatured: doc.isFeatured || false,
        });
      }
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/documents/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard/documents");
    } else {
      alert("Error al guardar");
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const flatCategories = categories.flatMap((cat) => [
    { id: cat.id, name: cat.name },
    ...(cat.children || []).map((child: any) => ({
      id: child.id,
      name: `  → ${child.name}`,
    })),
  ]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  return (
    <div>
      <Link href="/dashboard/documents" className="text-primary-500 hover:text-primary-700 text-sm mb-4 inline-block">
        ← Volver a Documentos
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Editar Documento
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="mensaje">Mensaje</option>
              <option value="directorio">Directorio</option>
              <option value="circular">Circular</option>
              <option value="reglamento">Reglamento</option>
              <option value="formacion">Formación</option>
              <option value="comunicado">Comunicado</option>
              <option value="aguinaldo">Aguinaldo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" required>
              <option value="">Seleccionar categoría</option>
              {flatCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
            <input name="author" value={form.author} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol del Autor</label>
            <select name="authorRole" value={form.authorRole} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="">Seleccionar</option>
              <option value="rector_mayor">Rector Mayor</option>
              <option value="coordinador_mundial">Coordinador Mundial</option>
              <option value="provincia">Provincia</option>
              <option value="centro">Centro Local</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4 text-primary-500 rounded" />
            <span className="text-sm text-gray-700">Publicado</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 text-primary-500 rounded" />
            <span className="text-sm text-gray-700">Destacado</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving}
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
