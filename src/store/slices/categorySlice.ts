import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CategoryItem } from 'type'
import { fetchCategories } from '../middleware'


export const loadCategories = createAsyncThunk<CategoryItem[], void>(
  'categories/fetccategories',
  async (): Promise<CategoryItem[]> => {
    const categories = await fetchCategories()
    return categories as CategoryItem[]
  },
)

const initialState = {
  categories: [] as CategoryItem[],
  activeCategoryId: '',
  error: '',
  loading: true,
}


export const categorySlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    loadCategoriesSuccess: (state, action) => {
      state.categories = action.payload
      state.activeCategoryId = ''
      state.loading = false
    },
    loadCategoriesError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    swapCategory: (state, action) => {
      state.activeCategoryId = action.payload
    },
    addCategory: (state, action) => {
      state.categories = [...state.categories, action.payload]
    },
    updateCategory: (state, action) => {
      state.categories = state.categories.map((category) =>
        category.id === action.payload ? {
          id: category.id,
          name: action.payload.name,
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
      state.activeCategoryId = newActiveCategoryId
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadCategories.fulfilled, (state, action: PayloadAction<CategoryItem[]>) => {
        state.loading = false
        categorySlice.caseReducers.loadCategoriesSuccess(state, action)
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'An error occurred'
        categorySlice.caseReducers.loadCategoriesError(state, action)
      })
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