import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NoteItem } from 'type'
import { requestNotes } from 'api'

export const fetchAsync = async (endpoint): Promise<NoteItem[]> => {
  try {

    const response = await endpoint()


    return JSON.parse(response)
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

// Create an async thunk
export const loadNotes = createAsyncThunk<NoteItem[], void>(
  'notes/fetchnotes',
  async () => {
    const notes = await fetchAsync(requestNotes)
    return notes
  },
)


const initialState = {
  notes: [] as NoteItem[],
  active: '',
  error: '',
  loading: true,

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
      state.notes = state.notes.filter(note => note.text !== '')
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
export const { addNote, updateNote, swapNote, deleteNote, pruneNote } = noteSlice.actions

export default noteSlice.reducer