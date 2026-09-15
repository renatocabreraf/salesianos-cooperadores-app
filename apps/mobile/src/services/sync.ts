import {
  saveBibleBooks,
  savePvaSections,
  getBibleBooks,
  getPvaSections,
  getDatabase,
} from "../database";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// ==========================================
// Bible Sync
// ==========================================

export async function syncBible(): Promise<boolean> {
  try {
    console.log("[Sync] Fetching Bible from:", `${API_URL}/api/bible`);
    const response = await fetch(`${API_URL}/api/bible`);
    console.log("[Sync] Bible response status:", response.status);
    if (!response.ok) return false;

    const result = await response.json();
    const books = result.data || [];
    console.log("[Sync] Bible books received:", books.length);

    if (books.length === 0) return false;

    const formattedBooks = books.map((book: any) => ({
      id: book.id,
      name: book.name,
      abbreviation: book.abbreviation,
      testament: book.testament,
      sortOrder: book.sortOrder,
      chapters: (book.chapters || []).map((ch: any) => ({
        id: ch.id,
        chapterNumber: ch.chapterNumber,
        verses: [],
      })),
    }));

    await saveBibleBooks(formattedBooks);
    const saved = await getBibleBooks();
    console.log("[Sync] Bible books saved to SQLite:", saved.length);
    return true;
  } catch (error) {
    console.error("[Sync] Error syncing Bible:", error);
    return false;
  }
}

export async function syncBibleBook(bookId: string): Promise<boolean> {
  try {
    console.log("[Sync] Fetching Bible book:", bookId);
    const response = await fetch(`${API_URL}/api/bible/${bookId}`);
    if (!response.ok) return false;

    const result = await response.json();
    const book = result.data;
    if (!book) return false;

    const db = await getDatabase();
    await db.withExclusiveTransactionAsync(async (txn) => {
      await txn.runAsync("DELETE FROM bible_chapters WHERE book_id = ?", bookId);

      for (const chapter of book.chapters || []) {
        await txn.runAsync(
          "INSERT INTO bible_chapters (id, book_id, chapter_number) VALUES (?, ?, ?)",
          chapter.id,
          bookId,
          chapter.chapterNumber
        );
        for (const verse of chapter.verses || []) {
          await txn.runAsync(
            "INSERT OR REPLACE INTO bible_verses (id, chapter_id, verse_number, text) VALUES (?, ?, ?, ?)",
            verse.id,
            chapter.id,
            verse.verseNumber,
            verse.text
          );
        }
      }
    });

    console.log("[Sync] Bible book saved:", book.name);
    return true;
  } catch (error) {
    console.error("[Sync] Error syncing Bible book:", error);
    return false;
  }
}

// ==========================================
// PVA Sync
// ==========================================

export async function syncPva(): Promise<boolean> {
  try {
    console.log("[Sync] Fetching PVA from:", `${API_URL}/api/pva`);
    const response = await fetch(`${API_URL}/api/pva`);
    console.log("[Sync] PVA response status:", response.status);
    if (!response.ok) return false;

    const result = await response.json();
    const sections = result.data || [];
    console.log("[Sync] PVA sections received:", sections.length);

    if (sections.length === 0) return false;

    const formatted = sections.map((s: any) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      content: s.content,
      chapter: s.chapter,
      article: s.article,
      section: s.section,
      sortOrder: s.sortOrder,
      parentId: s.parentId,
    }));

    await savePvaSections(formatted);
    const saved = await getPvaSections();
    console.log("[Sync] PVA sections saved to SQLite:", saved.length);
    return true;
  } catch (error) {
    console.error("[Sync] Error syncing PVA:", error);
    return false;
  }
}

// ==========================================
// Check if data needs syncing
// ==========================================

export async function needsSync(): Promise<{
  bible: boolean;
  pva: boolean;
}> {
  const books = await getBibleBooks();
  const sections = await getPvaSections();
  return {
    bible: books.length === 0,
    pva: sections.length === 0,
  };
}

export async function syncAll(): Promise<void> {
  const { bible, pva } = await needsSync();

  if (bible) {
    await syncBible();
  }
  if (pva) {
    await syncPva();
  }
}
