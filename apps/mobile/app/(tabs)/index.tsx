import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const quickAccess = [
  { label: "PVA", icon: "book-open" as const, href: "/pva/index", color: "#1e40af" },
  { label: "Biblia", icon: "book" as const, href: "/bible/index", color: "#7c3aed" },
  { label: "Biblioteca", icon: "library" as const, href: "/(tabs)/library", color: "#059669" },
  { label: "Mensajes", icon: "chatbubbles" as const, href: "/(tabs)/library", color: "#d97706" },
  { label: "Formación", icon: "school" as const, href: "/(tabs)/library", color: "#dc2626" },
  { label: "Provincia", icon: "map" as const, href: "/(tabs)/library", color: "#0891b2" },
];

const news = [
  {
    id: "1",
    title: "Bienvenido a la app",
    description: "Explora todos los recursos de los Salesianos Cooperadores",
    type: "info",
    icon: "information-circle",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salesianos Cooperadores</Text>
        <Text style={styles.headerSubtitle}>
          Buenos cristianos y honrados ciudadanos
        </Text>
      </View>

      {/* Quick Access Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.grid}>
          {quickAccess.map((item) => (
            <Link key={item.label} href={item.href} asChild>
              <TouchableOpacity style={styles.gridItem}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}>
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* News */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Novedades</Text>
        {news.map((item) => (
          <View key={item.id} style={styles.newsCard}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color="#1e40af"
              style={styles.newsIcon}
            />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Offline indicator */}
      <View style={styles.offlineSection}>
        <Link href="/offline" asChild>
          <TouchableOpacity style={styles.offlineCard}>
            <Ionicons name="download-outline" size={24} color="#1e40af" />
            <View style={styles.offlineContent}>
              <Text style={styles.offlineTitle}>Lectura Offline</Text>
              <Text style={styles.offlineDescription}>
                Descarga contenido para leer sin conexión
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </Link>
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
  header: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#bfdbfe",
    fontStyle: "italic",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  newsIcon: {
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  newsDescription: {
    fontSize: 13,
    color: "#64748b",
  },
  offlineSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  offlineCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  offlineContent: {
    flex: 1,
    marginLeft: 12,
  },
  offlineTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
  },
  offlineDescription: {
    fontSize: 13,
    color: "#3b82f6",
  },
});
