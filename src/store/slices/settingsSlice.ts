import { createSlice } from '@reduxjs/toolkit'
import { SettingsState, VimModes } from '../../type'


const initialState: SettingsState = {
  isOpen: false,
  vimState: {
    mode: VimModes.default,
  },
  codeMirrorOptions: {
    mode: 'grm',
    theme: 'base16-light',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
    keyMap: 'default',
    dragDrop: false,
  },
}


export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSettingsModal: (state) => {
      state.isOpen = !state.isOpen
    },
    updateVimStateMode: (state, action) => ({
      ...state,
      vimState: {
        mode: action.payload,
      },
    }),
    updateCodeMirrorOption: (state, action) => {
      const { key, value } = action.payload
      return {
        ...state,
        codeMirrorOptions: {
          ...state.codeMirrorOptions,
          [key]: value,
        },
      }
    },
  },
})


// Action creators are generated for each case reducer function
export const { toggleSettingsModal, updateCodeMirrorOption, updateVimStateMode } = settingsSlice.actions

export default settingsSlice.reducer