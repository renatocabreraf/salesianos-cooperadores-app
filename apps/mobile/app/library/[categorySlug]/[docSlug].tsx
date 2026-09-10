import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { addFavorite, isFavorite } from "../../../src/database";
import { useDeviceId } from "../../../src/hooks/useDeviceId";

export default function DocumentDetailScreen() {
  const { docSlug } = useLocalSearchParams<{ docSlug: string }>();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const deviceId = useDeviceId();

  useEffect(() => {
    loadDocument();
  }, [docSlug]);

  const loadDocument = async () => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/api/documents/${docSlug}`);
      const data = await res.json();
      setDoc(data.data);

      if (data.data) {
        const fav = await isFavorite(deviceId, "document", data.data.id);
        setIsFav(fav);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!doc) return;
    if (isFav) {
      setIsFav(false);
    } else {
      await addFavorite(deviceId, "document", doc.id);
      setIsFav(true);
    }
  };

  const handleShare = async () => {
    if (!doc) return;
    await Share.share({
      message: `${doc.title}\n\n${doc.content || doc.description || ""}`,
      title: doc.title,
    });
  };

  const handleDownload = () => {
    // TODO: Implement PDF download for offline
    alert("Descarga offline próximamente disponible");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={styles.center}>
        <Text>Documento no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.category}>{doc.category?.name}</Text>
          <Text style={styles.title}>{doc.title}</Text>
          {doc.author && (
            <Text style={styles.author}>Por: {doc.author}</Text>
          )}
          {doc.publishedAt && (
            <Text style={styles.date}>
              {new Date(doc.publishedAt).toLocaleDateString("es")}
            </Text>
          )}
        </View>

        {doc.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>{doc.description}</Text>
          </View>
        )}

        {doc.content && (
          <View style={styles.body}>
            <Text style={styles.textContent}>{doc.content}</Text>
          </View>
        )}

        {doc.fileUrl && (
          <View style={styles.downloadSection}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload}
            >
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.downloadText}>Descargar PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={22}
            color={isFav ? "#dc2626" : "#64748b"}
          />
          <Text style={[styles.actionLabel, isFav && { color: "#dc2626" }]}>
            Favorito
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color="#64748b" />
          <Text style={styles.actionLabel}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "#1e40af",
    padding: 20,
    paddingBottom: 24,
  },
  category: {
    fontSize: 12,
    fontWeight: "600",
    color: "#93c5fd",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 28,
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: "#bfdbfe",
  },
  date: {
    fontSize: 13,
    color: "#93c5fd",
    marginTop: 4,
  },
  descriptionSection: {
    padding: 20,
    paddingBottom: 0,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    fontStyle: "italic",
  },
  body: {
    padding: 20,
  },
  textContent: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 26,
  },
  downloadSection: {
    padding: 20,
  },
  downloadButton: {
    backgroundColor: "#1e40af",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  actionButton: {
    alignItems: "center",
    padding: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
});
