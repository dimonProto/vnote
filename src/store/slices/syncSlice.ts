import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  syncing: false,
  error: '',
}


export const syncSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    syncState: (state, action) => {
      state.syncing = true
    },
    syncStateSuccess: (state, action) => {
      state.syncing = false
    },
    syncStateError: (state, action) => {
      state.syncing = false
      state.error = action.payload
    },
  },
})


// Action creators are generated for each case reducer function
export const { syncState, syncStateSuccess, syncStateError } = syncSlice.actions

export default syncSlice.reducer