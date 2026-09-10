import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites } from "../src/database";
import { useDeviceId } from "../src/hooks/useDeviceId";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const deviceId = useDeviceId();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites(deviceId);
      setFavorites(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "document":
        return "document-text";
      case "pva":
        return "book-open";
      case "bible_verse":
        return "book";
      default:
        return "heart";
    }
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case "document":
        return "Documento";
      case "pva":
        return "PVA";
      case "bible_verse":
        return "Biblia";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="heart-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>Sin favoritos</Text>
          <Text style={styles.emptyDescription}>
            Guarda tus artículos, versículos y documentos favoritos aquí
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {favorites.map((fav) => (
            <TouchableOpacity key={fav.id} style={styles.favItem}>
              <Ionicons
                name={getItemIcon(fav.item_type) as any}
                size={24}
                color="#1e40af"
              />
              <View style={styles.favContent}>
                <Text style={styles.favType}>
                  {getItemTypeLabel(fav.item_type)}
                </Text>
                <Text style={styles.favId} numberOfLines={1}>
                  {fav.item_id}
                </Text>
              </View>
              <Ionicons name="heart" size={20} color="#dc2626" />
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    paddingVertical: 60,
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
    paddingHorizontal: 40,
  },
  list: {
    padding: 16,
  },
  favItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  favContent: {
    flex: 1,
    marginLeft: 12,
  },
  favType: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  favId: {
    fontSize: 14,
    color: "#334155",
    marginTop: 2,
  },
});
