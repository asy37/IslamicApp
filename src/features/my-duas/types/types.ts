import { Control, UseFormHandleSubmit } from "react-hook-form";
import { DuaFormData } from "./schema";

export type FilterType = "all" | "favorites";

export type DuaType = {
  id: string;
  date: string;
  text: string;
  title: string;
  isFavorite: boolean;
};

export type DuaCardProps = {
  readonly dua: DuaType;
  readonly isDark: boolean;
  readonly updateDua: (duaId: string, updates: { title?: string; text?: string; is_favorite?: boolean }) => Promise<void>;
  readonly deleteDua: (duaId: string) => Promise<void>;
  readonly toggleFavorite: (duaId: string) => Promise<void>;
  readonly isSaving: boolean;
};

export type DuaCardModalProps = {
  readonly dua: DuaType;
  readonly updateDua: (duaId: string, updates: { title?: string; text?: string; is_favorite?: boolean }) => Promise<void>;
  readonly deleteDua: (duaId: string) => Promise<void>;
  readonly isSaving: boolean;
  readonly isMore: boolean;
  readonly setIsMore: (isMore: boolean) => void;
  readonly control: Control<DuaFormData>;
  readonly handleSubmit: UseFormHandleSubmit<DuaFormData>;
};

export type DuaFormProps = {
  readonly control: Control<DuaFormData>;
};

export type DuasHeaderProps = {
  readonly setSearchQuery: (query: string) => void;
};

export type DuasListProps = {
  readonly duas: readonly DuaType[];
  readonly updateDua: (duaId: string, updates: { title?: string; text?: string; is_favorite?: boolean }) => Promise<void>;
  readonly deleteDua: (duaId: string) => Promise<void>;
  readonly toggleFavorite: (duaId: string) => Promise<void>;
  readonly isSaving: boolean;
};

export type FloatingActionButtonProps = {
  readonly createDua: (title: string, text: string, isFavorite?: boolean) => Promise<void>;
  readonly isSaving: boolean;
};

export interface Dua {
  id: string; // uuid
  user_id: string; // Supabase auth user id
  title: string;
  text: string;
  is_favorite: boolean;
  created_at: number; // milliseconds (Date.now())
  updated_at: number; // milliseconds (Date.now())
}

export interface SyncQueueItem {
  id: number; // autoincrement
  dua_id: string; // uuid
  action: 'create' | 'update' | 'delete';
  payload: string; // JSON string
  created_at: number; // milliseconds (Date.now())
}

export type DuaPayload = Omit<Dua, 'user_id'>;
