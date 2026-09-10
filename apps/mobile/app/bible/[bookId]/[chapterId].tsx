import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Share, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getBibleVerses } from "../../../src/database";
import { addFavorite, isFavorite } from "../../../src/database";
import { useDeviceId } from "../../../src/hooks/useDeviceId";

export default function BibleChapterScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const deviceId = useDeviceId();

  useEffect(() => {
    loadVerses();
  }, [chapterId]);

  const loadVerses = async () => {
    try {
      const data = await getBibleVerses(chapterId!);
      setVerses(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const text = verses
      .map((v) => `${v.verse_number}. ${v.text}`)
      .join("\n\n");
    await Share.share({
      message: text,
      title: "Versículos de la Biblia",
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando versículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {verses.map((verse) => (
            <View key={verse.id} style={styles.verseContainer}>
              <Text style={styles.verseNumber}>{verse.verse_number}</Text>
              <Text style={styles.verseText}>{verse.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
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
  body: {
    padding: 20,
  },
  verseContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  verseNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7c3aed",
    marginRight: 8,
    marginTop: 2,
    minWidth: 24,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
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
