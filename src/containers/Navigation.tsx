import React from 'react'
import { addNote, deleteNote, swapNote } from 'store/slices/noteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { downloadNote, getNoteTitle } from 'helpers'
import { useKey } from '../helpers/hooks'
import { syncState } from '../store/middleware'
import { NoteItem } from '../type'


const Navigation = () => {
  const activeNote = useSelector(({ notesState }) => notesState.notes?.find(note => note.id === notesState.active))
  const notes = useSelector(({ notesState }) => notesState.notes)
  const categories = useSelector(({ categoryState }) => categoryState.categories)
  const syncing = useSelector(({ syncState }) => syncState.syncing)


  const dispatch = useDispatch()

  const newNoteHandler = () => {
    const note: NoteItem = { id: uuidv4(), text: '', created: '', lastUpdated: '' }
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
    syncState(notes)
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