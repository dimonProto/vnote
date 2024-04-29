import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  syncing: false,
  error: '',
  lastSynced: '',
}


export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    syncState: (state, action) => {
      state.syncing = true
    },
    syncStateError: (state, action) => {
      state.syncing = false
      state.error = action.payload
    },
    syncStateSuccess: (state, action) => {
      state.syncing = false
      state.lastSynced = action.payload
    },
  },
})


// Action creators are generated for each case reducer function
export const { syncState, syncStateSuccess, syncStateError } = syncSlice.actions

export default syncSlice.reducer