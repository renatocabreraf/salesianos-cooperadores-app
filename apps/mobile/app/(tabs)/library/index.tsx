import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const sections = [
  {
    title: "Asociación de Salesianos Cooperadores",
    color: "#1e40af",
    items: [
      { name: "PVA - Proyecto de Vida Apostólica", icon: "book", href: "/pva" },
      { name: "Estatuto", icon: "document-text", href: "/pva?filter=estatuto" },
      { name: "Reglamento", icon: "document-text", href: "/pva?filter=reglamento" },
      { name: "Directorios", icon: "people", href: "/directorios" },
    ],
  },
  {
    title: "Congregación Salesiana",
    color: "#7c3aed",
    items: [
      { name: "Bibliografía", icon: "library", href: "/bibliografia" },
      { name: "Aguinaldos", icon: "gift", href: "/aguinaldos" },
    ],
  },
  {
    title: "Región Interamérica",
    color: "#059669",
    items: [],
  },
  {
    title: "Provincia",
    color: "#d97706",
    items: [
      { name: "Comunicados Provinciales", icon: "megaphone", href: "/library/comunicados-provinciales" },
    ],
  },
];

export default function LibraryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {sections.map((section) => (
        <View key={section.title} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name="folder" size={20} color={section.color} />
            <Text style={[styles.categoryTitle, { color: section.color }]}>
              {section.title}
            </Text>
          </View>

          {section.items.length === 0 ? (
            <Text style={styles.emptyText}>Próximamente</Text>
          ) : (
            section.items.map((item) => (
              <Link key={item.name} href={item.href as any} asChild>
                <TouchableOpacity style={styles.childItem}>
                  <Ionicons name={item.icon as any} size={20} color="#64748b" />
                  <Text style={styles.childName}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                </TouchableOpacity>
              </Link>
            ))
          )}
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  categorySection: { paddingHorizontal: 20, marginTop: 24 },
  categoryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  categoryTitle: { fontSize: 17, fontWeight: "700" },
  childItem: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  childName: { flex: 1, fontSize: 15, color: "#334155", marginLeft: 12, fontWeight: "500" },
  emptyText: { fontSize: 14, color: "#94a3b8", fontStyle: "italic", paddingLeft: 8 },
});
