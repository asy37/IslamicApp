/**
 * Arapça ayet metnini kelimelere bölen utility fonksiyonları
 * RTL kurallarına dikkat eder ve durakları normalize eder
 */

/**
 * Arapça metindeki durakları normalize eder
 * Bazı duraklar farklı Unicode karakterlerle temsil edilebilir
 */
function normalizeDiacritics(text: string): string {
  return text
    .normalize("NFC") // Unicode normalization
    .replace(/\u0640/g, "") // Tatweel (elongation) karakterini kaldır
    .trim();
}

/**
 * Arapça ayet metnini kelimelere böler
 * RTL kurallarına uygun şekilde kelimeleri ayırır
 * 
 * @param text - Arapça ayet metni
 * @returns Kelime dizisi (RTL sırasında)
 */
export function splitAyahText(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Metni normalize et
  const normalized = normalizeDiacritics(text);

  // Boşluklara göre böl (Arapça metinlerde kelimeler boşluklarla ayrılır)
  // Ayrıca bazı özel durumları da kontrol et
  const words = normalized
    .split(/\s+/)
    .filter((word) => word.length > 0) // Boş string'leri filtrele
    .map((word) => word.trim());

  return words;
}

/**
 * Kelime dizisini tekrar birleştirir (test/debug için)
 */
export function joinAyahWords(words: string[]): string {
  return words.join(" ");
}
