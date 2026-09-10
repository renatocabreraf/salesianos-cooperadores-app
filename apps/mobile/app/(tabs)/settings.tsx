import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Info */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SC</Text>
        </View>
        <Text style={styles.appName}>Salesianos Cooperadores</Text>
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Link href="/favorites" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart" size={22} color="#dc2626" />
            <Text style={styles.menuLabel}>Mis Favoritos</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </Link>

        <Link href="/offline" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="download" size={22} color="#059669" />
            <Text style={styles.menuLabel}>Descargas Offline</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications" size={22} color="#d97706" />
          <Text style={styles.menuLabel}>Notificaciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings" size={22} color="#64748b" />
          <Text style={styles.menuLabel}>Configuración</Text>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle" size={22} color="#1e40af" />
          <Text style={styles.menuLabel}>Sobre la App</Text>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle" size={22} color="#1e40af" />
          <Text style={styles.menuLabel}>Ayuda</Text>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Salesianos Cooperadores © 2026
        </Text>
        <Text style={styles.footerSubtext}>
          Buenos cristianos y honrados ciudadanos
        </Text>
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
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#1e40af",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  version: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    marginLeft: 12,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#cbd5e1",
    fontStyle: "italic",
    marginTop: 4,
  },
});
