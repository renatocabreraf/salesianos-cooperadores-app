import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  {
    name: "Asociación de Salesianos Cooperadores",
    slug: "asociacion-salesianos-cooperadores",
    icon: "people",
    color: "#1e40af",
    children: [
      { name: "PVA", slug: "pva", icon: "book-open" },
      { name: "Estatuto", slug: "estatuto", icon: "document-text" },
      { name: "Reglamento", slug: "reglamento", icon: "clipboard-list" },
      { name: "Directorios", slug: "directorios", icon: "book" },
    ],
  },
  {
    name: "Congregación Salesiana",
    slug: "congregacion-salesiana",
    icon: "church",
    color: "#7c3aed",
    children: [
      { name: "Rector Mayor", slug: "rector-mayor", icon: "chatbubbles" },
      { name: "Aguinaldos", slug: "aguinaldos", icon: "gift" },
      { name: "Coordinador Mundial", slug: "coordinador-mundial", icon: "globe" },
    ],
  },
  {
    name: "Provincia",
    slug: "provincia",
    icon: "map",
    color: "#059669",
    children: [
      { name: "Directorio Provincial", slug: "directorio-provincial", icon: "map-pin" },
      { name: "Comunicados", slug: "comunicados-provinciales", icon: "megaphone" },
    ],
  },
  {
    name: "Formación",
    slug: "formacion",
    icon: "school",
    color: "#d97706",
    children: [
      { name: "Formación Inicial", slug: "formacion-inicial", icon: "book-reader" },
      { name: "Formación Permanente", slug: "formacion-permanente", icon: "book" },
    ],
  },
];

export default function LibraryScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {categories.map((category) => (
        <View key={category.slug} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Ionicons name={category.icon as any} size={22} color={category.color} />
            <Text style={[styles.categoryTitle, { color: category.color }]}>
              {category.name}
            </Text>
          </View>

          {category.children.map((child) => (
            <Link
              key={child.slug}
              href={`/library/${child.slug}`}
              asChild
            >
              <TouchableOpacity style={styles.childItem}>
                <Ionicons name={child.icon as any} size={20} color="#64748b" />
                <Text style={styles.childName}>{child.name}</Text>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      ))}

      {/* PVA Quick Access */}
      <View style={styles.pvaSection}>
        <Link href="/pva/index" asChild>
          <TouchableOpacity style={styles.pvaCard}>
            <Ionicons name="book-open" size={32} color="#fff" />
            <View style={styles.pvaContent}>
              <Text style={styles.pvaTitle}>PVA Completo</Text>
              <Text style={styles.pvaDescription}>
                Navega por capítulos y artículos del Proyecto de Vida Apostólica
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Bible Quick Access */}
      <View style={styles.bibleSection}>
        <Link href="/bible/index" asChild>
          <TouchableOpacity style={styles.bibleCard}>
            <Ionicons name="book" size={32} color="#fff" />
            <View style={styles.pvaContent}>
              <Text style={styles.pvaTitle}>Santa Biblia</Text>
              <Text style={styles.pvaDescription}>
                Reina Valera 1960 - Navega por libros, capítulos y versículos
              </Text>
            </View>
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
  categorySection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  childItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  childName: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    marginLeft: 12,
    fontWeight: "500",
  },
  pvaSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  bibleSection: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  pvaCard: {
    backgroundColor: "#1e40af",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  bibleCard: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  pvaContent: {
    flex: 1,
    marginLeft: 16,
  },
  pvaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  pvaDescription: {
    fontSize: 13,
    color: "#bfdbfe",
    lineHeight: 18,
  },
});
