import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  dark: false,
}


export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkTheme: (state) => {
      state.dark = !state.dark
    },

  },
})


export const { toggleDarkTheme } = themeSlice.actions

export default themeSlice.reducer