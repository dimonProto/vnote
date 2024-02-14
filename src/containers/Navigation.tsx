import React from 'react'
import { addNote, deleteNote, swapNote } from 'store/slices/noteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { downloadNote, getNoteTitle } from 'helpers'
import { useKey } from '../helpers/hooks'
import { postState } from '../store/middleware'
import { CategoryItem, NoteItem } from '../type'
import moment from 'moment'
import { RootState } from '../store'


const Navigation = () => {
  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const syncing: boolean = useSelector(({ syncState }) => syncState.syncing)


  const dispatch = useDispatch()

  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuidv4(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
    }
    if ((activeNote && activeNote.text !== '') || !activeNote) {
      dispatch(addNote(note))
      dispatch(swapNote(note.id))
    }
  }

  const deleteHandler = () => {
    if (activeNote) {
      dispatch(deleteNote(activeNote.id))
    }
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote.text)
    }
  }

  const syncNotesHandler = () => {
    postState(notes, categories)
  }

  useKey('alt+k', () => {
    newNoteHandler()
  })
  useKey('alt+w', () => {
    deleteHandler()
  })
  useKey('alt+s', () => {
    syncNotesHandler()
  })

  return (
    <nav className='navigation'>
      <button className='nav-button' onClick={newNoteHandler}>+ New Note
      </button>
      <button
        className='nav-button'
        onClick={deleteHandler}
      >
        X Delete Note
      </button>
      <button
        className='nav-button'
        onClick={downloadNoteHandler}
      >
        ^ Download Note
      </button>
      <button
        className='nav-button'
        onClick={syncNotesHandler}
      >
        Sync notes
        {syncing && 'Syncing...'}
      </button>
    </nav>
  )
}

export default Navigation