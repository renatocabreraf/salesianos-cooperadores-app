import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getOfflineDocuments } from "../src/database";
import NetInfo from "@react-native-community/netinfo";

export default function OfflineScreen() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    loadData();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const docs = await getOfflineDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Connection Status */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: isConnected ? "#dcfce7" : "#fef2f2" },
        ]}
      >
        <Ionicons
          name={isConnected ? "wifi" : "wifi-outline"}
          size={20}
          color={isConnected ? "#16a34a" : "#dc2626"}
        />
        <Text
          style={[
            styles.statusText,
            { color: isConnected ? "#16a34a" : "#dc2626" },
          ]}
        >
          {isConnected ? "Conectado" : "Sin conexión"}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#1e40af" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Lectura Offline</Text>
          <Text style={styles.infoDescription}>
            Los documentos descargados se almacenan en tu dispositivo para
            lectura sin conexión a internet.
          </Text>
        </View>
      </View>

      {/* Downloaded Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descargados</Text>

        {documents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="download-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Sin descargas</Text>
            <Text style={styles.emptyDescription}>
              Descarga documentos desde la biblioteca para leerlos sin conexión
            </Text>
          </View>
        ) : (
          documents.map((doc) => (
            <View key={doc.id} style={styles.docItem}>
              <Ionicons name="document" size={24} color="#059669" />
              <View style={styles.docContent}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docMeta}>{doc.category_name}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
            </View>
          ))
        )}
      </View>

      {/* Storage Info */}
      <View style={styles.storageSection}>
        <Text style={styles.storageTitle}>Espacio utilizado</Text>
        <View style={styles.storageBar}>
          <View style={[styles.storageFill, { width: "5%" }]} />
        </View>
        <Text style={styles.storageText}>0 MB de 100 MB</Text>
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
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
  },
  infoDescription: {
    fontSize: 13,
    color: "#3b82f6",
    marginTop: 4,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  docItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  docContent: {
    flex: 1,
    marginLeft: 12,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  docMeta: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  storageSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  storageBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  storageFill: {
    height: "100%",
    backgroundColor: "#1e40af",
    borderRadius: 4,
  },
  storageText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
});
