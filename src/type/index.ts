export interface NoteItem {
  id: string
  text: string
  created: string
  lastUpdated: string
  category?: string
}

export interface CategoryItem {
  id: string
  name: string
}

export interface NoteState {
  notes: NoteItem[]
  activeNoteId: string
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

