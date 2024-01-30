import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NoteItem } from 'type'
import { requestNotes, saveState } from 'api'

export const fetchNotes = async (): Promise<NoteItem[]> => {
  try {
    const data = await requestNotes()
    return data as NoteItem[] // Ensure that the data is treated as an array of NoteItem
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

export const syncState = (state) => {
  try {
    return saveState(state)
  } catch (error) {
    throw new Error('Response status is not 200')
  }

}

export const noteSaga = async (state) => {
  await fetchNotes()
  await syncState(state)
}

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
  active: '',
  error: '',
  loading: true,
  syncing: false,

}


export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    loadNotesSuccess: (state, action) => {
      state.notes = action.payload
      state.active = action.payload.length > 0 ? action.payload[0].id : ''
    },
    loadNotesError: (state, action) => {
      state.error = action.payload
    },
    swapNote: (state, action) => {
      state.active = action.payload
    },
    asyncState: (state, action) => {
      state.notes = action.payload
      state.syncing = true
    },
    addNote: (state, action) => {
      state.notes = [...state.notes, action.payload]
    },
    deleteNote: (state, action) => {
      const deletedNoteIndex = state.notes.findIndex(note => note.id === action.payload)
      let newActiveNoteId = ''

      if (deletedNoteIndex === 0 && state.notes[1]) {
        newActiveNoteId = state.notes[deletedNoteIndex + 1].id
      } else if (state.notes[deletedNoteIndex - 1]) {
        newActiveNoteId = state.notes[deletedNoteIndex - 1].id
      }
      state.notes = state.notes.filter(note => note.id !== action.payload)
      state.active = newActiveNoteId
    },
    pruneNote: (state) => {
      state.notes = state.notes.filter(note => note.text !== '' || note.id !== state.active)
    },
    updateNote: (state, action) => {
      state.notes = state.notes.map((note) =>
        note.id === action.payload.id
          ? {
            id: note.id,
            text: action.payload.text,
            created: '',
            lastUpdated: '',
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
        state.syncing = false
        noteSlice.caseReducers.loadNotesSuccess(state, action)
      })
      .addCase(loadNotes.rejected, (state, action) => {
        state.loading = false
        state.syncing = false
        state.error = action.error.message || 'An error occurred'
        noteSlice.caseReducers.loadNotesError(state, action)
      })
  },
})


// Action creators are generated for each case reducer function
export const { addNote, updateNote, swapNote, deleteNote, pruneNote, asyncState } = noteSlice.actions

export default noteSlice.reducer