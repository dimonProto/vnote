import {combineReducers, configureStore} from '@reduxjs/toolkit'
import noteReducer from "./slices/noteSlice"
import activeReducer from "./slices/activeSlice";

const rootReducer = combineReducers({
  notesState: noteReducer,
  activeState: activeReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch