import * as SQLite from "expo-sqlite";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(database?: SQLite.SQLiteDatabase): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    db = database;
    await initTables(db);
    await initialSync(db);
    return db;
  }
  if (db) return db;

  db = await SQLite.openDatabaseAsync("salesianos_cooperadores.db");
  await initTables(db);
  await initialSync(db);
  return db;
}

async function initTables(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS pva_sections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      article INTEGER,
      section TEXT,
      sort_order INTEGER DEFAULT 0,
      parent_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bible_books (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      testament TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bible_chapters (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      chapter_number INTEGER NOT NULL,
      FOREIGN KEY (book_id) REFERENCES bible_books(id)
    );

    CREATE TABLE IF NOT EXISTS bible_verses (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL,
      verse_number INTEGER NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (chapter_id) REFERENCES bible_chapters(id)
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      content TEXT,
      type TEXT NOT NULL,
      file_url TEXT,
      cover_image TEXT,
      author TEXT,
      category_name TEXT,
      published_at TEXT,
      is_featured INTEGER DEFAULT 0,
      downloaded INTEGER DEFAULT 0,
      local_file_path TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(device_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS sync_status (
      id INTEGER PRIMARY KEY DEFAULT 1,
      last_sync_at TEXT,
      pva_synced INTEGER DEFAULT 0,
      bible_synced INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_pva_chapter ON pva_sections(chapter);
    CREATE INDEX IF NOT EXISTS idx_pva_slug ON pva_sections(slug);
    CREATE INDEX IF NOT EXISTS idx_bible_books_testament ON bible_books(testament);
    CREATE INDEX IF NOT EXISTS idx_bible_chapters_book ON bible_chapters(book_id);
    CREATE INDEX IF NOT EXISTS idx_bible_verses_chapter ON bible_verses(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
    CREATE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug);
    CREATE INDEX IF NOT EXISTS idx_favorites_device ON favorites(device_id);
  `);
}

async function initialSync(database: SQLite.SQLiteDatabase) {
  try {
    const bookCount = await database.getFirstAsync<any>(
      "SELECT COUNT(*) as count FROM bible_books"
    );
    if (bookCount?.count === 0) {
      console.log("[DB] Bible empty, syncing from API...");
      const res = await fetch(`${API_URL}/api/bible`);
      if (res.ok) {
        const result = await res.json();
        const books = result.data || [];
        if (books.length > 0) {
          await database.withExclusiveTransactionAsync(async (txn) => {
            for (const book of books) {
              await txn.runAsync(
                "INSERT INTO bible_books (id, name, abbreviation, testament, sort_order) VALUES (?, ?, ?, ?, ?)",
                book.id, book.name, book.abbreviation, book.testament, book.sortOrder
              );
              for (const ch of book.chapters || []) {
                await txn.runAsync(
                  "INSERT INTO bible_chapters (id, book_id, chapter_number) VALUES (?, ?, ?)",
                  ch.id, book.id, ch.chapterNumber
                );
              }
            }
          });
          console.log("[DB] Bible synced:", books.length, "books");
        }
      }
    }

    const pvaCount = await database.getFirstAsync<any>(
      "SELECT COUNT(*) as count FROM pva_sections"
    );
    if (pvaCount?.count === 0) {
      console.log("[DB] PVA empty, syncing from API...");
      const res = await fetch(`${API_URL}/api/pva`);
      if (res.ok) {
        const result = await res.json();
        const sections = result.data || [];
        if (sections.length > 0) {
          await database.withExclusiveTransactionAsync(async (txn) => {
            for (const s of sections) {
              await txn.runAsync(
                `INSERT INTO pva_sections (id, title, slug, content, chapter, article, section, sort_order, parent_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                s.id, s.title, s.slug, s.content, s.chapter,
                s.article || null, s.section || null, s.sortOrder || 0, s.parentId || null
              );
            }
          });
          console.log("[DB] PVA synced:", sections.length, "sections");
        }
      }
    }
  } catch (error) {
    console.error("[DB] Initial sync error:", error);
  }
}

// ==========================================
// PVA Operations
// ==========================================
export async function getPvaSections() {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM pva_sections ORDER BY chapter, sort_order"
  );
}

export async function getPvaSectionBySlug(slug: string) {
  const db = await getDatabase();
  return db.getFirstAsync<any>(
    "SELECT * FROM pva_sections WHERE slug = ?",
    slug
  );
}

export async function searchPva(query: string) {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM pva_sections WHERE title LIKE ? OR content LIKE ? ORDER BY chapter, sort_order",
    [`%${query}%`, `%${query}%`]
  );
}

export async function savePvaSections(sections: any[]) {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync("DELETE FROM pva_sections");
    for (const section of sections) {
      await txn.runAsync(
        `INSERT INTO pva_sections (id, title, slug, content, chapter, article, section, sort_order, parent_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        section.id,
        section.title,
        section.slug,
        section.content,
        section.chapter,
        section.article || null,
        section.section || null,
        section.sortOrder || 0,
        section.parentId || null
      );
    }
  });
}

// ==========================================
// Bible Operations
// ==========================================
export async function getBibleBooks() {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM bible_books ORDER BY sort_order"
  );
}

export async function getBibleChapters(bookId: string) {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM bible_chapters WHERE book_id = ? ORDER BY chapter_number",
    bookId
  );
}

export async function getBibleVerses(chapterId: string) {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM bible_verses WHERE chapter_id = ? ORDER BY verse_number",
    chapterId
  );
}

export async function searchBible(query: string) {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    `SELECT v.*, c.chapter_number, b.name as book_name, b.abbreviation
     FROM bible_verses v
     JOIN bible_chapters c ON v.chapter_id = c.id
     JOIN bible_books b ON c.book_id = b.id
     WHERE v.text LIKE ?
     ORDER BY b.sort_order, c.chapter_number, v.verse_number`,
    [`%${query}%`]
  );
}

export async function saveBibleBooks(books: any[]) {
  const db = await getDatabase();
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.execAsync("DELETE FROM bible_verses");
    await txn.execAsync("DELETE FROM bible_chapters");
    await txn.execAsync("DELETE FROM bible_books");

    for (const book of books) {
      await txn.runAsync(
        "INSERT INTO bible_books (id, name, abbreviation, testament, sort_order) VALUES (?, ?, ?, ?, ?)",
        book.id,
        book.name,
        book.abbreviation,
        book.testament,
        book.sortOrder
      );
      for (const chapter of book.chapters || []) {
        await txn.runAsync(
          "INSERT INTO bible_chapters (id, book_id, chapter_number) VALUES (?, ?, ?)",
          chapter.id,
          book.id,
          chapter.chapterNumber
        );
        for (const verse of chapter.verses || []) {
          await txn.runAsync(
            "INSERT INTO bible_verses (id, chapter_id, verse_number, text) VALUES (?, ?, ?, ?)",
            verse.id,
            chapter.id,
            verse.verseNumber,
            verse.text
          );
        }
      }
    }
  });
}

// ==========================================
// Documents Operations
// ==========================================
export async function getOfflineDocuments() {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM documents WHERE downloaded = 1 ORDER BY created_at DESC"
  );
}

export async function saveDocument(doc: any) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO documents 
     (id, title, slug, description, content, type, file_url, cover_image, author, category_name, published_at, is_featured, downloaded, local_file_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    doc.id,
    doc.title,
    doc.slug,
    doc.description || null,
    doc.content || null,
    doc.type,
    doc.fileUrl || null,
    doc.coverImage || null,
    doc.author || null,
    doc.categoryName || null,
    doc.publishedAt || null,
    doc.isFeatured ? 1 : 0,
    doc.downloaded ? 1 : 0,
    doc.localFilePath || null
  );
}

export async function markDocumentDownloaded(id: string, localPath: string) {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE documents SET downloaded = 1, local_file_path = ? WHERE id = ?",
    localPath,
    id
  );
}

// ==========================================
// Favorites Operations
// ==========================================
export async function getFavorites(deviceId: string) {
  const db = await getDatabase();
  return db.getAllAsync<any>(
    "SELECT * FROM favorites WHERE device_id = ? ORDER BY created_at DESC",
    deviceId
  );
}

export async function addFavorite(
  deviceId: string,
  itemType: string,
  itemId: string
) {
  const db = await getDatabase();
  const id = `${deviceId}-${itemType}-${itemId}`;
  await db.runAsync(
    "INSERT OR IGNORE INTO favorites (id, device_id, item_type, item_id) VALUES (?, ?, ?, ?)",
    id,
    deviceId,
    itemType,
    itemId
  );
}

export async function removeFavorite(id: string) {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM favorites WHERE id = ?", id);
}

export async function isFavorite(
  deviceId: string,
  itemType: string,
  itemId: string
): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<any>(
    "SELECT 1 FROM favorites WHERE device_id = ? AND item_type = ? AND item_id = ?",
    deviceId,
    itemType,
    itemId
  );
  return !!result;
}
