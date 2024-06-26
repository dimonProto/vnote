import React from 'react'

export interface NoteItem {
  id: string
  text: string
  created: string
  lastUpdated: string
  category?: string
  trash?: boolean
  favorite?: boolean
  searchValue: string
}

export interface CategoryItem {
  id: string
  name: string
}

export interface NoteState {
  notes: NoteItem[]
  activeNoteId: string
  activeFolder: string
  activeCategoryId: string
  error: string
  loading: boolean
  syncing: boolean
  searchValue: string
}

export interface CategoryState {
  categories: CategoryItem[]
  activeCategoryId: string
  error: string
  loading: boolean
}

export interface PreviewMarkdownState {
  previewMarkdown: boolean
}

export interface SyncState {
  syncing: boolean
  error: string
  lastSynced: string
}

export interface SettingsState {
  isOpen: boolean
  codeMirrorOptions: { [key: string]: any }

}

export interface ThemeState {
  dark: boolean
}

export interface RootState {
  categoryState: CategoryState
  noteState: NoteState
  settingsState: SettingsState
  syncState: SyncState
  themeState: ThemeState
  previewMarkdown: PreviewMarkdownState
}

export interface SyncStatePayload {
  categories: CategoryItem[]
  notes: NoteItem[]
}

export type ReactDragEvent = React.DragEvent<HTMLDivElement>

export type ReactMouseEvent =
  | MouseEvent
  | React.MouseEvent<HTMLDivElement>
  | React.ChangeEvent<HTMLSelectElement>

export type ReactSubmitEvent = React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
