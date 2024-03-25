import React from 'react'

export interface NoteItem {
  id: string
  text: string
  created: string
  lastUpdated: string
  category?: string
  trash?: boolean
  favorite?: boolean
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
}

export interface CategoryState {
  categories: CategoryItem[]
  activeCategoryId: string
  error: string
  loading: boolean
}


export interface SettingsState {
  isOpen: boolean
  codeMirrorOptions: { [key: string]: any }
}

export type ReactDragEvent = React.DragEvent<HTMLDivElement>

export type ReactMouseEvent =
  | MouseEvent
  | React.MouseEvent<HTMLDivElement>
  | React.ChangeEvent<HTMLSelectElement>

export type ReactSubmitEvent = React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
