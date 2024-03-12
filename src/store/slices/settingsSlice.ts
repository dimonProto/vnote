import { createSlice } from '@reduxjs/toolkit'
import { SettingsState } from '../../type'


const initialState: SettingsState = {
  isOpen: false,
  codeMirrorOptions: {
    mode: 'grm',
    theme: 'base16-light',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
  },
}


export const settingsSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    toggleSettingsModal: (state) => {
      state.isOpen = !state.isOpen
    },

  },
})


// Action creators are generated for each case reducer function
export const { toggleSettingsModal } = settingsSlice.actions

export default settingsSlice.reducer