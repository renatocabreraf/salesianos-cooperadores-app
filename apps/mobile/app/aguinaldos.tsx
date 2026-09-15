import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const aguinaldos = [
  { id: "1", year: "2026", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202026.pdf" },
  { id: "2", year: "2025", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202025.pdf" },
  { id: "3", year: "2024", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202024.pdf" },
  { id: "4", year: "2023", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202023.pdf" },
  { id: "5", year: "2022", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202022.pdf" },
  { id: "6", year: "2021", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202021.pdf" },
  { id: "7", year: "2020", url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/aguinaldos/Aguinaldo%202020.pdf" },
];

export default function AguinaldosScreen() {
  const handleOpen = (item: typeof aguinaldos[0]) => {
    router.push({
      pathname: "/pdf",
      params: { url: item.url, title: `Aguinaldo ${item.year}` },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="gift" size={28} color="#fff" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Aguinaldos</Text>
          <Text style={styles.headerSubtitle}>Aguinaldos Salesianos</Text>
        </View>
      </View>

      <View style={styles.list}>
        {aguinaldos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleOpen(item)}
          >
            <Ionicons name="gift" size={24} color="#7c3aed" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Aguinaldo {item.year}</Text>
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
  cardHint: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
});
