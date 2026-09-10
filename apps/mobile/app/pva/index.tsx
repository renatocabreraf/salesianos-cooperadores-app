import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getPvaSections } from "../../src/database";

export default function PvaIndex() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const local = await getPvaSections();
      if (local.length > 0) {
        setSections(local);
      }
    } catch (error) {
      console.error("Error loading PVA:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedByChapter = sections.reduce((acc: any, section: any) => {
    const chapter = section.chapter || 1;
    if (!acc[chapter]) acc[chapter] = [];
    acc[chapter].push(section);
    return acc;
  }, {});

  const chapters = Object.keys(groupedByChapter)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando PVA...</Text>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="book-open-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyTitle}>PVA no disponible</Text>
        <Text style={styles.emptyDescription}>
          El Proyecto de Vida Apostólica será descargado cuando tengas conexión a internet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyecto de Vida Apostólica</Text>
        <Text style={styles.headerSubtitle}>
          De los Salesianos Cooperadores
        </Text>
      </View>

      {chapters.map((chapter) => (
        <View key={chapter} style={styles.chapterSection}>
          <View style={styles.chapterHeader}>
            <Text style={styles.chapterTitle}>Capítulo {chapter}</Text>
          </View>

          {groupedByChapter[chapter].map((section: any) => (
            <Link key={section.id} href={`/pva/${section.slug}`} asChild>
              <TouchableOpacity style={styles.articleItem}>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>{section.title}</Text>
                  {section.section && (
                    <Text style={styles.articleSection}>{section.section}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      ))}

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
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
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
    lineHeight: 20,
  },
  header: {
    backgroundColor: "#1e40af",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#bfdbfe",
    marginTop: 4,
  },
  chapterSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  chapterHeader: {
    marginBottom: 12,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e40af",
  },
  articleItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  articleSection: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
});
