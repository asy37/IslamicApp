/**
 * Dhikr type for frontend usage
 * Uses number (milliseconds) for timestamps to match SQLite storage
 * Note: user_id is NOT part of this type - it's only used during persistence/sync
 */
export type Dhikr = {
  id: string;                 // uuid
  slug: string;               // 'subhanallah'
  label: string;              // 'SubhanAllah'
  target_count: number;       // 100
  current_count: number;      // 20
  status: 'active' | 'completed';
  started_at: number;         // milliseconds (Date.now())
  completed_at: number | null; // milliseconds (Date.now()) | null
}

export type DhikrStats = {
  week: {
    completed: number;
    active: number;
  };
  month: {
    completed: number;
    active: number;
  };
  year: {
    completed: number;
    active: number;
  };
}

export type DhikirSelectProps = {
    readonly currentDhikr: Dhikr | null;
    readonly openDhikrSelect: boolean;
    readonly setOpenDhikrSelect: (value: boolean) => void;
    readonly setCurrentDhikr: (dhikr: Dhikr) => void;
};

export type DhikirStatsProps = {
    readonly visible: boolean;
    readonly onClose: () => void;
};

export type DhikrAddProps = {
    readonly openAddDhikrModal: boolean;
    readonly setOpenAddDhikrModal: (value: boolean) => void;
    readonly onDhikrAdded?: (dhikr: Dhikr) => void;
};

export type DhikrBottomBarProps = {
    readonly currentDhikr: Dhikr | null;
    readonly onReset: () => void;
    readonly isDark: boolean;
    readonly setCurrentDhikr: (item: Dhikr) => void;
};

export type DhikrCounterProps = {
    readonly count: number;
    readonly dhikrName: string;
    readonly target: number;
    readonly isDark: boolean;
};

export type DhikrHeaderProps = {
    readonly isDark: boolean;
    readonly setOpenAddDhikrModal: (value: boolean) => void;
};
