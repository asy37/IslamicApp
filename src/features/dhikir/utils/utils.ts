import { dhikrRepo } from "@/lib/database/dhikr/repository";
import { Dhikr } from "../types";

/**
 * Ensures the user has at least one dhikr (the default preset) in the database.
 * If the user has no dhikrs, it creates the default preset and returns its slug.
 * If the user already has dhikrs, it returns the slug of the first dhikr.
 */
export async function initializeUserDhikrs(userId: string): Promise<string | null> {
    const records = await dhikrRepo.getAllDhikrs(userId);

    if (records.length > 0) {
        return records[0].slug;
    }

    if (DHIKR_PRESETS.length > 0) {
        const defaultPreset = DHIKR_PRESETS[0];
        const now = Date.now();
        const id = generateUUID();

        // Insert the default preset to SQLite so useDhikr can find it
        await dhikrRepo.upsertDhikr({
            id,
            user_id: userId,
            slug: defaultPreset.slug,
            label: defaultPreset.label,
            target_count: defaultPreset.target_count,
            current_count: 0,
            status: 'active',
            started_at: now,
            completed_at: null,
            is_dirty: true,
            last_synced_at: null,
            updated_at: now,
        });

        return defaultPreset.slug;
    }

    return null;
}

export const DHIKR_PRESETS: Readonly<Dhikr[]> = [
    {
        id: '1',
        slug: 'subhanallah',
        label: 'Subhanallah',
        target_count: 33,
        current_count: 0,
        status: 'active',
        started_at: Date.now(),
        completed_at: null,
    },
    {
        id: '2',
        slug: 'alhamdulillah',
        label: 'Alhamdulillah',
        target_count: 33,
        current_count: 0,
        status: 'active',
        started_at: Date.now(),
        completed_at: null,
    },
    {
        id: '3',
        slug: 'allahuakbar',
        label: 'Allahu Akbar',
        target_count: 33,
        current_count: 0,
        status: 'active',
        started_at: Date.now(),
        completed_at: null,
    },
];

/**
 * Generate UUID v4
 * React Native compatible UUID generator
 */
export function generateUUID(): string {
    // eslint-disable-next-line prefer-replace-all
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.trunc(Math.random() * 16);
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Generate slug from label
 * - Lowercase
 * - Replace spaces with hyphens
 * - Remove special characters
 */
export function generateSlug(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replaceAll(/\s+/g, '-')
        .replaceAll(/[^a-z0-9-]/g, '');
}

export const validate = (label: string, targetCount: string, setErrors: (errors: { label?: string; targetCount?: string }) => void): boolean => {
    const newErrors: { label?: string; targetCount?: string } = {};

    if (!label.trim()) {
        newErrors.label = "dhikr.errors.nameRequired";
    }

    const target = Number.parseInt(targetCount, 10);
    if (!targetCount.trim()) {
        newErrors.targetCount = "dhikr.errors.targetRequired";
    } else if (Number.isNaN(target) || target <= 0) {
        newErrors.targetCount = "dhikr.errors.targetPositive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};