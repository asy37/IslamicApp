import { getDb } from "../db";

type Direction = "rtl" | "ltr";

type SaveQuranTranslationInput = Readonly<{
  edition_identifier: string;
  language: string;
  name: string;
  direction: Direction;
  data: unknown; // FULL QURAN JSON
}>;

export type TranslationMetadata = Readonly<{
  edition_identifier: string;
  language: string;
  name: string;
  direction: Direction;
  created_at: number; // milliseconds (Date.now())
}>;

/**
 * 1️⃣ saveQuranTranslation
 *
 * - Persists full Quran translation JSON as a single row
 * - Uses INSERT OR REPLACE to avoid duplicate editions
 * - `data` is stored as JSON string
 * - `created_at` is always Date.now() in milliseconds
 */
export async function saveQuranTranslation(
  input: SaveQuranTranslationInput
): Promise<void> {
  const db = await getDb();

  const { edition_identifier, language, name, direction, data } = input;
  const now = Date.now(); // milliseconds only
  const json = JSON.stringify(data);

  await db.runAsync(
    `INSERT OR REPLACE INTO quran_translations (
      edition_identifier,
      language,
      name,
      direction,
      data,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [edition_identifier, language, name, direction, json, now]
  );
}

/**
 * 2️⃣ getTranslationByIdentifier
 *
 * - Returns parsed JSON payload for given edition identifier
 * - Returns null if not found
 */
export async function getTranslationByIdentifier(
  identifier: string
): Promise<unknown | null> {
  const db = await getDb();

  const row = await db.getFirstAsync<{
    data: string;
  }>(
    `SELECT data
     FROM quran_translations
     WHERE edition_identifier = ?`,
    [identifier]
  );

  if (!row) return null;

  try {
    return JSON.parse(row.data);
  } catch {
    // Eğer JSON bozulmuşsa, null dön (UI katmanı hatayı ele alabilir)
    return null;
  }
}

/**
 * 3️⃣ getDownloadedTranslations
 *
 * - Returns metadata list for all downloaded translations
 * - Does NOT return the heavy JSON `data` field (performance)
 */
export async function getDownloadedTranslations(): Promise<
  TranslationMetadata[]
> {
  const db = await getDb();

  const rows = await db.getAllAsync<{
    edition_identifier: string;
    language: string;
    name: string;
    direction: Direction;
    created_at: number;
  }>(
    `SELECT
      edition_identifier,
      language,
      name,
      direction,
      created_at
     FROM quran_translations
     ORDER BY created_at DESC`
  );

  return rows.map((row) => ({
    edition_identifier: row.edition_identifier,
    language: row.language,
    name: row.name,
    direction: row.direction,
    created_at: row.created_at,
  }));
}

/**
 * 4️⃣ isTranslationDownloaded
 *
 * - Returns true if a translation with given identifier exists
 */
export async function isTranslationDownloaded(
  identifier: string
): Promise<boolean> {
  const db = await getDb();

  const row = await db.getFirstAsync<{
    exists: number;
  }>(
    `SELECT 1 as exists
     FROM quran_translations
     WHERE edition_identifier = ?
     LIMIT 1`,
    [identifier]
  );

  return !!row;
}

/**
 * 5️⃣ deleteTranslation (opsiyonel)
 *
 * - Removes stored translation for given edition identifier
 */
export async function deleteTranslation(identifier: string): Promise<void> {
  const db = await getDb();

  await db.runAsync(
    `DELETE FROM quran_translations
     WHERE edition_identifier = ?`,
    [identifier]
  );
}


