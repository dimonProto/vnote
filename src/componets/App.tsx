import React, { useEffect } from 'react'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import AppSidebar from 'containers/AppSidebar'
import { loadNotes } from '../store/slices/noteSlice'
import { AppDispatch } from '../store'
import { useDispatch } from 'react-redux'
import { loadCategories } from '../store/slices/categorySlice'


const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(loadNotes())
  }, [dispatch])

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  return (
    <div className='app'>
      <AppSidebar />
      <NoteList />
      <NoteEditor />
      <KeyboardShortcuts />
    </div>
  )
}

export default App
