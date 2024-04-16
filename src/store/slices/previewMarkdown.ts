import { createSlice } from '@reduxjs/toolkit'
import { PreviewMarkdownState } from 'type'


const initialState: PreviewMarkdownState = {
  previewMarkdown: false,
}


export const previewMarkdownSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    togglePreviewMarkdown: (state) => {
      state.previewMarkdown = !state.previewMarkdown
    },

  },
})


// Action creators are generated for each case reducer function
export const { togglePreviewMarkdown } = previewMarkdownSlice.actions

export default previewMarkdownSlice.reducer