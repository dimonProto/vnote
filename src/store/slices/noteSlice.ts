import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NoteItem } from 'type'
import { fetchNotes } from '../middleware'
import { Folders } from '../../constants/codeMirrorOptions'


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
  activeFolder: 'ALL',
  activeNoteId: '',
  activeCategoryId: '',
  error: '',
  loading: true,
}


export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    loadNotesSuccess: (state, action) => {
      state.notes = action.payload
      state.activeNoteId = action.payload.length > 0 ? action.payload[0].id : ''
    },
    loadNotesError: (state, action) => {
      state.error = action.payload
    },
    swapNote: (state, action) => {
      state.activeNoteId = action.payload
    },
    swapCategory: (state, action) => {
      state.activeCategoryId = action.payload
      state.activeFolder = Folders.NONE
      state.activeNoteId = getFirstNote(Folders.NONE, state.notes, action.payload)
    },
    swapFolder: (state, action) => {
      state.activeFolder = action.payload
      state.activeCategoryId = ''
      state.activeNoteId = getFirstNote('', state.notes, action.payload)
    },
    addNote: (state, action) => {
      state.notes = [action.payload, ...state.notes]
    },
    sendNoteToTrash: (state, action) => {
      state.notes = state.notes.map(note => note.id === action.payload ?
        {
          ...note,
          trash: true,
        } : note,
      )
      state.activeNoteId = getNewNoteId(state.notes, action.payload)
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload)
      state.activeNoteId = getNewNoteId(state.notes, action.payload)
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
  sendNoteToTrash,
  swapCategory,
  swapFolder,
} = noteSlice.actions

export default noteSlice.reducer


export const getFirstNote = (folder: string, notes: NoteItem[], categoryId?: string) => {
  switch (folder) {
    case Folders.NONE:
      return notes.find(note => note.category === categoryId) ? notes.find(note => note.category === categoryId)!.id : ''
    case Folders.ALL:
      return notes.length > 0 ? notes[0].id : ''
    case Folders.TRASH:
      return notes.find(note => note.trash) ? notes.find(note => note.trash)!.id : ''
    default:
      return ''
  }
}


const getNewNoteId = (notes: NoteItem[], payload: string) => {

  const deletedNoteIndex = notes.findIndex(note => note.id === payload)
  let newActiveNoteId = ''

  if (deletedNoteIndex === 0 && notes[1]) {
    newActiveNoteId = notes[deletedNoteIndex + 1].id
  } else if (notes[deletedNoteIndex - 1]) {
    newActiveNoteId = notes[deletedNoteIndex - 1].id
  }

  return newActiveNoteId
}