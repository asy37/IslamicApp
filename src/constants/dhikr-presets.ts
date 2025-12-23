/**
 * Preset dhikr configurations
 */

export interface DhikrPreset {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  target: number;
  description: string;
}

export const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    name: 'Subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    target: 33,
    description: 'Allah\'ı tesbih etmek',
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    target: 33,
    description: 'Allah\'a hamd etmek',
  },
  {
    id: 'allahu_akbar',
    name: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    target: 34,
    description: 'Allah\'ı tekbir etmek',
  },
];

