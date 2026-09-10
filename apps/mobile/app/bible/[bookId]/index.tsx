import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getBibleChapters } from "../../../src/database";

export default function BibleBookScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookName, setBookName] = useState("");

  useEffect(() => {
    loadChapters();
  }, [bookId]);

  const loadChapters = async () => {
    try {
      const data = await getBibleChapters(bookId!);
      setChapters(data);
      if (data.length > 0 && data[0].book_name) {
        setBookName(data[0].book_name);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando capítulos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{bookName || "Libro"}</Text>
        <Text style={styles.headerSubtitle}>
          {chapters.length} capítulos
        </Text>
      </View>

      <View style={styles.grid}>
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/bible/${bookId}/${chapter.id}`}
            asChild
          >
            <TouchableOpacity style={styles.chapterItem}>
              <Text style={styles.chapterNumber}>{chapter.chapter_number}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

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
  },
  header: {
    backgroundColor: "#7c3aed",
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
    color: "#ddd6fe",
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 8,
  },
  chapterItem: {
    width: 56,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7c3aed",
  },
});
