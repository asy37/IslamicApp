

export interface BookmarkedAyah {
    number: number;
    surahNumber?: number;
    surahArabicName: string;
    surahTranslation: string;
    text: string;
    translationText?: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda:
    | boolean
    | {
        id: number;
        recommended: boolean;
        obligatory: boolean;
    };
}