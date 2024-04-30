import React, { useEffect } from 'react'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import AppSidebar from 'containers/AppSidebar'
import { loadNotes } from '../store/slices/noteSlice'
import { AppDispatch, RootState } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { loadCategories } from '../store/slices/categorySlice'
import { TempStateProvider } from '../context/TempStateProvider'
import SettingsModal from './SettingsModal'
import { Helmet } from 'react-helmet'
import { Folders } from '../constants'
import { HelmetProvider } from 'react-helmet-async'
import { useInterval } from '../helpers/hooks'
import { syncState } from '../store/slices/syncSlice'
import { NoteItem } from '../type'


const App: React.FC = () => {
  const dark = useSelector(({ themeState }) => themeState.dark)
  const activeFolder: Folders = useSelector(({ notesState }) => notesState.activeFolder)
  const { categories } = useSelector((state: RootState) => state.categoryState)
  const activeCategoryId = useSelector(({ notesState }) => notesState.activeCategoryId)
  const activeCategory = categories.find(({ id }) => id === activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const dispatch: AppDispatch = useDispatch()


  useEffect(() => {
    dispatch(loadNotes())
  }, [dispatch])

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  useInterval(() => {
    dispatch(syncState({ notes, categories }))
  }, 20000)

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet='utf-8' />
        <title>
          {activeFolder === Folders.CATEGORY
            ? activeCategory
              ? `${activeCategory.name} | TakeNote`
              : `TakeNote`
            : `${Folders[activeFolder]} | TakeNote`}
        </title>
        <link rel='canonical' href='https://takenote.dev' />
      </Helmet>

      <div className={`app ${dark ? 'dark' : ''}`}>
        <TempStateProvider>
          <AppSidebar />
          <NoteList />
          <NoteEditor />
          <KeyboardShortcuts />
          <SettingsModal />
        </TempStateProvider>
      </div>
    </HelmetProvider>

  )
}

export default App
