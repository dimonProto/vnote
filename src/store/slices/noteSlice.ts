import { createSlice } from '@reduxjs/toolkit'
import initialState from "constants/fakeState";

export interface Note {
  id: string,
  text: string,
  created: string,
  lastUpdated: string
}

export interface NoteState {
  notes: Note[];
}

// const initialState: NoteState = {
//   notes: [],
// };

export const noteSlice = createSlice({
  name: 'note',
  initialState  ,
  reducers: {
    addNote: (state, action) => {
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    },
    updateNote: (state, action) => {

      state.notes = state.notes.map((note) =>
          note.id === action.payload.id
              ? {
                id: note.id,
                text: action.payload.text,
                created: note.created,
                lastUpdated: 'new-value',
              }
              : note
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { addNote,updateNote } = noteSlice.actions

export default noteSlice.reducer