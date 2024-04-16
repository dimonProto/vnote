import React from 'react'
import { addNote, swapNote, toggleTrashedNote } from 'store/slices/noteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { downloadNote, getNoteTitle, newNote } from 'helpers'
import { useInterval, useKey } from '../helpers/hooks'
import { postState } from '../store/middleware'
import { CategoryItem, NoteItem } from '../type'
import { RootState } from '../store'
import { useTempState } from '../context/TempStateProvider'
import { toggleDarkTheme } from '../store/slices/themeSlice'
import { syncState } from '../store/slices/syncSlice'
import { updateCodeMirrorOption } from '../store/slices/settingsSlice'
import { togglePreviewMarkdown } from '../store/slices/previewMarkdown'

// @ts-ignore
const KeyboardShortcuts = () => {
  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))
  const activeCategoryId = useSelector(({ notesState }) => notesState.activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeFolder = useSelector(({ notesState }) => notesState.activeFolder)
  const dark = useSelector(({ themeState }) => themeState.dark)

  const { addingTempCategory, setAddingTempCategory } = useTempState()

  const dispatch = useDispatch()

  const newNoteHandler = () => {
    const note = newNote(activeCategoryId, activeFolder)
    if ((activeNote && activeNote.text !== '' && !activeNote.trash) || !activeNote) {
      dispatch(addNote(note))
      dispatch(swapNote(note.id))
    }
  }

  const togglePreviewMarkdownHandler = () => {
    dispatch(togglePreviewMarkdown())
  }

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const trashNoteHandler = () => {

    if (activeNote) {
      dispatch(toggleTrashedNote(activeNote.id))
    }
  }

  const toggleDarkThemeHandler = () => {
    dispatch(toggleDarkTheme())
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote)
    }
  }

  const syncNotesHandler = () => {
    postState(notes, categories)
  }

  useKey('alt+n', () => {
    newNoteHandler()
  })

  useKey('alt+t', () => {
    toggleDarkThemeHandler()
    dispatch(updateCodeMirrorOption({ key: 'theme', value: dark ? 'base16-light' : 'zenburn' }))
  })

  useKey('alt+c', () => {
    newTempCategoryHandler()
  })

  useKey('alt+j', () => {
    togglePreviewMarkdownHandler()
  })

  useKey('alt+w', () => {
    trashNoteHandler()
  })

  useKey('alt+s', () => {
    syncNotesHandler()
  })

  useKey('alt+d', () => {
    downloadNoteHandler()
  })

  useInterval(() => {
    dispatch(syncState({ notes, categories }))
  }, 3000)

  return null

}

export default KeyboardShortcuts