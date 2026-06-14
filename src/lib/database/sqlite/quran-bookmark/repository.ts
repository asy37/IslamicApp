import * as SQLite from "expo-sqlite";
import { getDb } from "../db";
import type { Ayah } from "@/types/quran";

class QuranBookmarkRepository {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    if (this.db) return;
    this.db = await getDb();
    // Dynamically ensure the bookmarks table exists
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS quran_bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ayah_number INTEGER NOT NULL UNIQUE,
        surah_number INTEGER NOT NULL,
        ayah_number_in_surah INTEGER NOT NULL,
        surah_name TEXT NOT NULL,
        surah_translation TEXT NOT NULL,
        ayah_text TEXT NOT NULL,
        translation_text TEXT,
        juz INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  }

  /**
   * Add an Ayah to bookmarks
   */
  async addBookmark(ayah: Ayah): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");

    const now = Date.now();
    await this.db.runAsync(
      `INSERT OR REPLACE INTO quran_bookmarks (
        ayah_number,
        surah_number,
        ayah_number_in_surah,
        surah_name,
        surah_translation,
        ayah_text,
        translation_text,
        juz,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ayah.number,
        ayah.surahNumber ?? 1,
        ayah.numberInSurah,
        ayah.surahArabicName,
        ayah.surahTranslation,
        ayah.text,
        ayah.translationText ?? "",
        ayah.juz,
        now,
      ]
    );
  }

  /**
   * Remove an Ayah from bookmarks by its global number
   */
  async removeBookmark(ayahNumber: number): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      "DELETE FROM quran_bookmarks WHERE ayah_number = ?",
      [ayahNumber]
    );
  }

  /**
   * Check if a given Ayah global number is bookmarked
   */
  async isBookmarked(ayahNumber: number): Promise<boolean> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM quran_bookmarks WHERE ayah_number = ?",
      [ayahNumber]
    );
    return (result?.count ?? 0) > 0;
  }

  /**
   * Get all bookmarked Ayahs ordered by created_at DESC
   */
  async getBookmarks(): Promise<Ayah[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");

    const results = await this.db.getAllAsync<{
      ayah_number: number;
      surah_number: number;
      ayah_number_in_surah: number;
      surah_name: string;
      surah_translation: string;
      ayah_text: string;
      translation_text: string;
      juz: number;
    }>("SELECT * FROM quran_bookmarks ORDER BY created_at DESC");

    return results.map((row) => ({
      number: row.ayah_number,
      surahNumber: row.surah_number,
      numberInSurah: row.ayah_number_in_surah,
      surahArabicName: row.surah_name,
      surahTranslation: row.surah_translation,
      text: row.ayah_text,
      translationText: row.translation_text || undefined,
      juz: row.juz,
      manzil: 1,
      page: 1,
      ruku: 1,
      hizbQuarter: 1,
      sajda: false,
    }));
  }
}

export const quranBookmarkRepo = new QuranBookmarkRepository();
