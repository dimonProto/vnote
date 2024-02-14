import { combineReducers, configureStore } from '@reduxjs/toolkit'
import noteReducer from './slices/noteSlice'
import syncReducer from './slices/syncSlice'
import categoryReducer from './slices/categorySlice'

const rootReducer = combineReducers({
  notesState: noteReducer,
  syncState: syncReducer,
  categoryState: categoryReducer,
})


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ['ignoredPath', 'ignoredNested.one', 'ignoredNested.two'],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type  RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch