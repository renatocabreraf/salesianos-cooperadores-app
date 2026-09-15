import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const directorios = [
  {
    id: "1",
    title: "Directorio Provincial CAM Norte",
    url: "https://pub-ee91390519ef464585e03d4fd03ae2b4.r2.dev/directorios/Copia%20de%20Directorio%20Provincial.pdf",
  },
];

export default function DirectoriosScreen() {
  const handleOpen = (item: typeof directorios[0]) => {
    router.push({
      pathname: "/pdf",
      params: { url: item.url, title: item.title },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="people" size={28} color="#fff" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Directorios</Text>
          <Text style={styles.headerSubtitle}>Directorios disponibles</Text>
        </View>
      </View>

      <View style={styles.list}>
        {directorios.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleOpen(item)}
          >
            <Ionicons name="document-text" size={24} color="#1e40af" />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
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
  header: { backgroundColor: "#1e40af", padding: 20, flexDirection: "row", alignItems: "center", gap: 12, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#bfdbfe", marginTop: 2 },
  list: { padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  cardHint: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
});
