import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import pvaData from "../../assets/pva.json";

const sections: any[] = pvaData;

export default function PvaDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const section = sections.find((s) => s.slug === slug);

  const handleShare = async () => {
    if (!section) return;
    await Share.share({
      message: `${section.title}\n\n${section.content}`,
      title: section.title,
    });
  };

  if (!section) {
    return (
      <View style={styles.center}>
        <Text>Sección no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.chapterLabel}>Capítulo {section.chapter}</Text>
          {section.article && (
            <Text style={styles.articleLabel}>Artículo {section.article}</Text>
          )}
          <Text style={styles.title}>{section.title}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.textContent}>{section.content}</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { flex: 1 },
  header: { backgroundColor: "#1e40af", padding: 20, paddingBottom: 24 },
  chapterLabel: { fontSize: 13, fontWeight: "600", color: "#93c5fd", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  articleLabel: { fontSize: 13, color: "#93c5fd", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", lineHeight: 28 },
  body: { padding: 20 },
  textContent: { fontSize: 16, color: "#334155", lineHeight: 26 },
  bottomBar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, paddingBottom: 32, borderTopWidth: 1, borderTopColor: "#e2e8f0", backgroundColor: "#fff" },
  actionButton: { alignItems: "center", padding: 8 },
  actionLabel: { fontSize: 12, color: "#64748b", marginTop: 4 },
});
