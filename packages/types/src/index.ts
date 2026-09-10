// ==========================================
// TIPOS COMPARTIDOS - SALESIANOS COOPERADORES
// ==========================================

// ---- API Responses ----
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---- Categories ----
export interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  level: string | null;
  children?: CategoryWithChildren[];
  _count?: {
    documents: number;
  };
}

// ---- Documents ----
export interface DocumentListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  coverImage: string | null;
  fileUrl: string | null;
  author: string | null;
  authorRole: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  downloadCount: number;
  viewCount: number;
  category: {
    name: string;
    slug: string;
    icon: string | null;
  };
}

export interface DocumentDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  htmlContent: string | null;
  type: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  coverImage: string | null;
  author: string | null;
  authorRole: string | null;
  province: string | null;
  center: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  downloadCount: number;
  viewCount: number;
  category: {
    name: string;
    slug: string;
    icon: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

// ---- PVA ----
export interface PvaSectionListItem {
  id: string;
  title: string;
  slug: string;
  chapter: number;
  article: number | null;
  section: string | null;
  sortOrder: number;
}

export interface PvaSectionDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  chapter: number;
  article: number | null;
  section: string | null;
  sortOrder: number;
  parentId: string | null;
  children?: PvaSectionListItem[];
  previous?: {
    slug: string;
    title: string;
  } | null;
  next?: {
    slug: string;
    title: string;
  } | null;
}

// ---- Bible ----
export interface BibleBookListItem {
  id: string;
  name: string;
  abbreviation: string;
  testament: string;
  sortOrder: number;
  _count?: {
    chapters: number;
  };
}

export interface BibleChapterListItem {
  id: string;
  chapterNumber: number;
  _count?: {
    verses: number;
  };
}

export interface BibleVerse {
  id: string;
  verseNumber: number;
  text: string;
}

export interface BibleChapterDetail {
  id: string;
  chapterNumber: number;
  book: {
    name: string;
    abbreviation: string;
    testament: string;
  };
  verses: BibleVerse[];
  previous?: {
    chapterNumber: number;
  } | null;
  next?: {
    chapterNumber: number;
  } | null;
}

// ---- Favorites ----
export type FavoriteItemType = "document" | "pva" | "bible_verse";

export interface FavoriteItem {
  id: string;
  deviceId: string;
  itemType: FavoriteItemType;
  itemId: string;
  createdAt: string;
}

// ---- Search ----
export interface SearchResult {
  type: "document" | "pva" | "bible";
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  icon?: string;
}

// ---- News / Novedades ----
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  type: "document" | "message" | "formation" | "alert";
  category: string;
  publishedAt: string;
  icon: string;
}

// ---- Device Config ----
export interface DeviceConfig {
  deviceId: string;
  province: string | null;
  center: string | null;
  lastSyncAt: string | null;
}

// ---- Notifications ----
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
}

// ---- Admin ----
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
}

export interface DashboardStats {
  totalDocuments: number;
  totalCategories: number;
  totalPvaSections: number;
  totalBibleBooks: number;
  totalNotifications: number;
  recentDocuments: DocumentListItem[];
}
