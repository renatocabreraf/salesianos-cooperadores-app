import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const bibliografia = [
  {
    id: "1",
    title: "Memorias del Oratorio",
    author: "San Juan Bosco",
    url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/uploads/1788924175348-Memorias-del-Oratorio.pdf",
  },
  {
    id: "2",
    title: "Memoria Histórica del Centro Don Bosco, Guatemala",
    url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/uploads/Memoria%20Histo%CC%81rica%20del%20Centro%20Don%20Bosco.pdf",
  },
];

export default function BibliografiaScreen() {
  const handleOpen = (item: typeof bibliografia[0]) => {
    router.push({
      pathname: "/pdf",
      params: { url: item.url, title: item.title },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="library" size={28} color="#fff" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Bibliografía</Text>
          <Text style={styles.headerSubtitle}>Bibliografía Salesiana</Text>
        </View>
      </View>

      <View style={styles.list}>
        {bibliografia.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleOpen(item)}
          >
            <Ionicons name="book" size={24} color="#7c3aed" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.author && (
                <Text style={styles.cardAuthor}>{item.author}</Text>
              )}
              <Text style={styles.cardHint}>Toca para abrir PDF</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#7c3aed", padding: 20, flexDirection: "row", alignItems: "center", gap: 12, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#ddd6fe", marginTop: 2 },
  list: { padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  cardAuthor: { fontSize: 13, color: "#64748b", marginTop: 2 },
  cardHint: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
});
