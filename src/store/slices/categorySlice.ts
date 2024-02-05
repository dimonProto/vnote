import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  categories: [],
  active: '',
  error: '',
  loading: true,
}


export const categorySlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    loadCategoriesSuccess: (state, action) => {
      state.categories = action.payload
      state.active = ''
      state.loading = false
    },
    loadCategoriesError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    swapCategory: (state, action) => {
      state.active = action.payload
    },
    addCategory: (state, action) => {
      state.categories = action.payload
    },
    updateCategory: (state, action) => {
      state.categories = state.categories.map((category) =>
        category.id === action.payload ? {
          id: category.id,
          name: action.payload.title,
        } : category,
      )
    },
    deleteCategory: (state, action) => {
      const deletedCategoryIndex = state.categories.findIndex(category => category.id === action.payload)
      let newActiveCategoryId = ''
      if (deletedCategoryIndex === 0 && state.categories[1]) {
        newActiveCategoryId = state.categories[deletedCategoryIndex + 1].id
      } else if (state.categories[deletedCategoryIndex - 1]) {
        newActiveCategoryId = state.categories[deletedCategoryIndex - 1].id
      }
      state.categories = state.categories.filter(category => category.id !== action.payload)
      state.active = newActiveCategoryId
    },
  },
})


// Action creators are generated for each case reducer function
export const {
  loadCategoriesSuccess,
  loadCategoriesError,
  swapCategory,
  updateCategory,
  addCategory,
  deleteCategory,
} = categorySlice.actions

export default categorySlice.reducer