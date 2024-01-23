import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NoteItem } from '../../type'

export const fetchDataFromAPI = async (): Promise<NoteItem[]> => {
  try {
    const response = await fetch('https://gist.githubusercontent.com/dimonProto/c00f59564c39b458c2c0141bb856382b/raw/44bdcd6b8174706c9d17f0eb2393c0e51278c2e9/gistfile1.txt')
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    return Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

// Create an async thunk
export const loadNotes = createAsyncThunk<NoteItem[], void>(
  'data/fetchData',
  async () => {
    const data = await fetchDataFromAPI()
    return data
  },
)


const initialState = {
  data: [] as NoteItem[],
  active: '',
  error: '',
  loading: true,

}


export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    loadNotesSuccess: (state, action) => {
      state.data = action.payload
      state.active = action.payload.length > 0 ? action.payload[0].id : ''
    },
    loadNotesError: (state, action) => {
      state.error = action.payload
    },
    swapNote: (state, action) => {
      state.active = action.payload
    },
    addNote: (state, action) => {
      state.data = [...state.data, action.payload]
    },
    deleteNote: (state, action) => {
      const noteIndex = state.data.findIndex(note => note.id === action.payload)
      const newActiveNoteId = state.data[noteIndex - 1] ? state.data[noteIndex - 1].id : ''
      state.data = state.data.filter(note => note.id !== action.payload)
      state.active = newActiveNoteId
    },
    pruneNote: (state) => {
      state.data = state.data.filter(note => note.text !== '')
    },
    updateNote: (state, action) => {
      state.data = state.data.map((note) =>
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