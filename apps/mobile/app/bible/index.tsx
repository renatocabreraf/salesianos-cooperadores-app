import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getBibleBooks } from "../../src/database";

export default function BibleIndex() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBibleBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const oldTestament = books.filter((b) => b.testament === "AT");
  const newTestament = books.filter((b) => b.testament === "NT");

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando Biblia...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="book-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyTitle}>Biblia no disponible</Text>
        <Text style={styles.emptyDescription}>
          La Biblia será descargada cuando tengas conexión a internet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Antiguo Testamento */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { backgroundColor: "#fef3c7" }]}>
          <Ionicons name="book" size={20} color="#92400e" />
          <Text style={[styles.sectionTitle, { color: "#92400e" }]}>
            Antiguo Testamento
          </Text>
          <Text style={styles.sectionCount}>{oldTestament.length} libros</Text>
        </View>

        <View style={styles.booksGrid}>
          {oldTestament.map((book) => (
            <Link key={book.id} href={`/bible/${book.id}`} asChild>
              <TouchableOpacity style={styles.bookItem}>
                <Text style={styles.bookName}>{book.name}</Text>
                <Text style={styles.bookAbbr}>{book.abbreviation}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* Nuevo Testamento */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { backgroundColor: "#dbeafe" }]}>
          <Ionicons name="book" size={20} color="#1e40af" />
          <Text style={[styles.sectionTitle, { color: "#1e40af" }]}>
            Nuevo Testamento
          </Text>
          <Text style={styles.sectionCount}>{newTestament.length} libros</Text>
        </View>

        <View style={styles.booksGrid}>
          {newTestament.map((book) => (
            <Link key={book.id} href={`/bible/${book.id}`} asChild>
              <TouchableOpacity style={styles.bookItem}>
                <Text style={styles.bookName}>{book.name}</Text>
                <Text style={styles.bookAbbr}>{book.abbreviation}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
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
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  sectionCount: {
    fontSize: 13,
    color: "#64748b",
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bookItem: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bookName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
  },
  bookAbbr: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
});
