import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import pvaData from "../../assets/pva.json";

const allSections: any[] = pvaData;

const estatutoChapters = [0, 1, 2, 3, 4, 5, 6];
const reglamentoChapters = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

function ChapterGroup({ title, color, chapters }: { title: string; color: string; chapters: number[] }) {
  return (
    <View style={styles.groupSection}>
      <View style={[styles.groupHeader, { backgroundColor: color + "15" }]}>
        <Ionicons name="document-text" size={20} color={color} />
        <Text style={[styles.groupTitle, { color }]}>{title}</Text>
      </View>

      {chapters.map((chapter) => {
        const items = allSections.filter((s) => s.chapter === chapter);
        return (
          <View key={chapter} style={styles.chapterSection}>
            {chapter > 0 && (
              <View style={styles.chapterHeader}>
                <Text style={styles.chapterTitle}>Capítulo {chapter}</Text>
              </View>
            )}
            {items.map((section: any) => (
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
        );
      })}
    </View>
  );
}

export default function PvaIndex() {
  const { filter } = useLocalSearchParams<{ filter?: string }>();

  const showEstatuto = !filter || filter === "estatuto";
  const showReglamento = !filter || filter === "reglamento";

  const title = filter === "estatuto"
    ? "Estatuto"
    : filter === "reglamento"
    ? "Reglamento"
    : "Proyecto de Vida Apostólica";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>De los Salesianos Cooperadores</Text>
      </View>

      {showEstatuto && (
        <ChapterGroup
          title="Estatuto"
          color="#1e40af"
          chapters={estatutoChapters}
        />
      )}

      {showReglamento && (
        <ChapterGroup
          title="Reglamento"
          color="#059669"
          chapters={reglamentoChapters}
        />
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#1e40af", padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#bfdbfe", marginTop: 4 },
  groupSection: { marginTop: 24, paddingHorizontal: 20 },
  groupHeader: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 12, marginBottom: 12, gap: 8 },
  groupTitle: { fontSize: 16, fontWeight: "700", flex: 1 },
  chapterSection: { marginBottom: 12 },
  chapterHeader: { marginBottom: 8 },
  chapterTitle: { fontSize: 15, fontWeight: "600", color: "#64748b" },
  articleItem: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  articleContent: { flex: 1 },
  articleTitle: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  articleSection: { fontSize: 13, color: "#64748b", marginTop: 2 },
});
