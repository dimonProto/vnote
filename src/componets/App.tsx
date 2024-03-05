import React, { useEffect } from 'react'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import AppSidebar from 'containers/AppSidebar'
import { loadNotes } from '../store/slices/noteSlice'
import { AppDispatch } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { loadCategories } from '../store/slices/categorySlice'
import { KeyboardProvider } from '../context/KeyboardContext'


const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const dark = useSelector(({ themeState }) => themeState.dark)

  let themeClass = ''

  if (dark) {
    themeClass = 'dark'
  }
  
  useEffect(() => {
    dispatch(loadNotes())
  }, [dispatch])

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  return (
    <div className={`app ${themeClass}`}>
      <KeyboardProvider>
        <AppSidebar />
        <NoteList />
        <NoteEditor />
        <KeyboardShortcuts />
      </KeyboardProvider>
    </div>
  )
}

export default App
