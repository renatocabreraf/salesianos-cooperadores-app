import { View, Text, ScrollView, StyleSheet, Share, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import bibleData from "../../../assets/bible.json";

const books: any[] = bibleData;

export default function BibleChapterScreen() {
  const { bookId, chapterId } = useLocalSearchParams<{ bookId: string; chapterId: string }>();
  const book = books.find((b) => b.id === bookId);
  const chapter = book?.chapters?.find((ch: any) => ch.id === chapterId);
  const verses = chapter?.verses || [];

  const handleShare = async () => {
    const text = verses.map((v: any) => `${v.verseNumber}. ${v.text}`).join("\n\n");
    await Share.share({ message: text, title: "Versículos de la Biblia" });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{book?.name || ""}</Text>
          <Text style={styles.headerSubtitle}>Capítulo {chapter?.chapterNumber || ""}</Text>
        </View>
        <View style={styles.body}>
          {verses.map((verse: any) => (
            <View key={verse.id} style={styles.verseContainer}>
              <Text style={styles.verseNumber}>{verse.verseNumber}</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
  header: { backgroundColor: "#7c3aed", padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#ddd6fe", marginTop: 4 },
  body: { padding: 20 },
  verseContainer: { flexDirection: "row", marginBottom: 16 },
  verseNumber: { fontSize: 13, fontWeight: "700", color: "#7c3aed", marginRight: 8, marginTop: 2, minWidth: 24 },
  verseText: { flex: 1, fontSize: 16, color: "#334155", lineHeight: 24 },
  bottomBar: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, paddingBottom: 32, borderTopWidth: 1, borderTopColor: "#e2e8f0", backgroundColor: "#fff" },
  actionButton: { alignItems: "center", padding: 8 },
  actionLabel: { fontSize: 12, color: "#64748b", marginTop: 4 },
});
