import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NoteItem } from 'type'
import { fetchNotes } from '../middleware'
import { Folders } from '../../constants'
import { sortByFavourites, sortByLastUpdated } from '../../helpers'


// Create an async thunk
export const loadNotes = createAsyncThunk<NoteItem[], void>(
  'notes/fetchnotes',
  async () => {
    const notes = await fetchNotes()
    return notes
  },
)


const initialState = {
  notes: [] as NoteItem[],
  activeFolder: Folders.ALL,
  activeNoteId: '',
  activeCategoryId: '',
  error: '',
  loading: true,
  searchValue: '',
}


export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    loadNotesSuccess: (state, action) => {
      state.notes = action.payload
      state.activeNoteId = getFirstNoteId(Folders.ALL, action.payload)
    },
    loadNotesError: (state, action) => {
      state.error = action.payload
    },
    swapNote: (state, action) => {
      state.activeNoteId = action.payload
    },
    swapCategory: (state, action) => {
      state.activeCategoryId = action.payload
      state.activeFolder = Folders.CATEGORY
      state.activeNoteId = getFirstNoteId(Folders.CATEGORY, state.notes, action.payload)
    },
    searchNotes: (state, action) => {
      state.searchValue = action.payload
    },
    swapFolder: (state, action) => {
      state.activeFolder = action.payload
      state.activeCategoryId = ''
      state.activeNoteId = getFirstNoteId('', state.notes, action.payload)
    },
    addNote: (state, action) => {
      state.notes = [action.payload, ...state.notes]
    },
    toggleFavoriteNote: (state, action) => {
      state.notes = state.notes.map(note => note.id === action.payload
        ? {
          ...note,
          favorite: !note.favorite,
        } : note)
    },
    toggleTrashedNote: (state, action) => {
      state.notes = state.notes.map(note => note.id === action.payload ?
        {
          ...note,
          trash: !note.trash,
        } : note,
      )
      state.activeNoteId = getNewNoteId(state.notes, action.payload, state.activeCategoryId)
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload)
      state.activeNoteId = getNewNoteId(state.notes, action.payload, state.activeCategoryId)
    },
    emptyTrash: (state) => {
      state.notes = state.notes.filter(note => !note.trash)
    },
    pruneNote: (state) => {
      state.notes = state.notes.filter(note => note.text !== '' || note.id !== state.activeNoteId)
    },
    pruneCategoryFromNotes: (state, action) => {
      state.notes = state.notes.map(note =>
        note.category === action.payload ?
          {
            ...note,
            category: undefined,
          } : note,
      )
    },
    addCategoryToNote: (state, action) => {
      state.notes = state.notes.map((note) =>
        note.id === action.payload.noteId
          ? {
            ...note,
            category: action.payload.categoryId,
          } : note)
    },
    updateNote: (state, action) => {
      state.notes = state.notes.map((note) =>
        note.id === action.payload.id
          ? {
            ...note,
            text: action.payload.text,
            lastUpdated: action.payload.lastUpdated,
          }
          : note,
      )
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNotes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadNotes.fulfilled, (state, action: PayloadAction<NoteItem[]>) => {
        state.loading = false
        noteSlice.caseReducers.loadNotesSuccess(state, action)
      })
      .addCase(loadNotes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
        noteSlice.caseReducers.loadNotesError(state, action)
      })
  },
})


// Action creators are generated for each case reducer function
export const {
  addNote,
  updateNote,
  swapNote,
  deleteNote,
  pruneNote,
  addCategoryToNote,
  pruneCategoryFromNotes,
  toggleTrashedNote,
  swapCategory,
  swapFolder,
  toggleFavoriteNote,
  searchNotes,
  emptyTrash,
} = noteSlice.actions

export default noteSlice.reducer


export const getFirstNoteId = (folder: string, notes: NoteItem[], categoryId?: string) => {

  const notesNotTrash = notes.filter(note => !note.trash).sort(sortByLastUpdated).sort(sortByFavourites)
  const firstNoteCategory = notesNotTrash.find(note => note.category === categoryId)
  const firstNoteFavorite = notesNotTrash.find(note => note.favorite)
  const firstNoteTrash = notes.find(note => note.trash)


  switch (folder) {
    case Folders.CATEGORY:
      return firstNoteCategory ? firstNoteCategory.id : ''
    case Folders.FAVORITES:
      return firstNoteFavorite ? firstNoteFavorite.id : ''
    case Folders.ALL:
      return notesNotTrash.length > 0 ? notes[0].id : ''
    case Folders.TRASH:
      return firstNoteTrash ? firstNoteTrash.id : ''
    default:
      return ''
  }
}


const getNewNoteId = (notes: NoteItem[], oldNoteId: string, activeCategoryId: string) => {
  const notesNotTrash = activeCategoryId
    ? notes.filter(note => !note.trash && note.category === activeCategoryId)
    : notes.filter(note => !note.trash)

  const deletedNoteIndex = notesNotTrash.findIndex(note => note.id === oldNoteId)
  let newActiveNoteId = ''

  if (deletedNoteIndex === 0 && notesNotTrash[1]) {
    newActiveNoteId = notesNotTrash[deletedNoteIndex + 1].id
  } else if (notesNotTrash[deletedNoteIndex - 1]) {
    newActiveNoteId = notesNotTrash[deletedNoteIndex - 1].id
  }

  return newActiveNoteId
}