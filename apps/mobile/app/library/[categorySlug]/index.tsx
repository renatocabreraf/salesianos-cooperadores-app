import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryScreen() {
  const { categorySlug } = useLocalSearchParams<{ categorySlug: string }>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    loadDocuments();
  }, [categorySlug]);

  const loadDocuments = async () => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(
        `${API_URL}/api/documents?category=${categorySlug}`
      );
      const data = await res.json();
      setDocuments(data.data || []);

      // Get category name from first doc
      if (data.data?.length > 0) {
        setCategoryName(data.data[0].category?.name || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mensaje":
        return "chatbubbles";
      case "directorio":
        return "book";
      case "circular":
        return "megaphone";
      case "reglamento":
        return "document-text";
      case "formacion":
        return "school";
      case "comunicado":
        return "megaphone";
      default:
        return "document";
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando documentos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {documents.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Sin documentos</Text>
          <Text style={styles.emptyDescription}>
            No hay documentos disponibles en esta categoría
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/library/${categorySlug}/${doc.slug}`}
              asChild
            >
              <TouchableOpacity style={styles.docCard}>
                <Ionicons
                  name={getTypeIcon(doc.type) as any}
                  size={24}
                  color="#1e40af"
                />
                <View style={styles.docContent}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  {doc.description && (
                    <Text style={styles.docDescription} numberOfLines={2}>
                      {doc.description}
                    </Text>
                  )}
                  <View style={styles.docMeta}>
                    {doc.author && (
                      <Text style={styles.docAuthor}>{doc.author}</Text>
                    )}
                    {doc.publishedAt && (
                      <Text style={styles.docDate}>
                        {new Date(doc.publishedAt).toLocaleDateString("es")}
                      </Text>
                    )}
                  </View>
                </View>
                {doc.fileUrl && (
                  <Ionicons name="document-outline" size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  list: {
    padding: 16,
  },
  docCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  docContent: {
    flex: 1,
    marginLeft: 12,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  docDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  docMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  docAuthor: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
  docDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
