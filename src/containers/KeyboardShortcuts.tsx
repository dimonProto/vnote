import React from 'react'
import { addNote, sendNoteToTrash, swapNote } from 'store/slices/noteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { downloadNote, getNoteTitle, newNote } from 'helpers'
import { useKey } from '../helpers/hooks'
import { postState } from '../store/middleware'
import { CategoryItem, NoteItem } from '../type'
import { RootState } from '../store'

// @ts-ignore
const KeyboardShortcuts = () => {
  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))
  const activeCategoryId = useSelector(({ notesState }) => notesState.activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeFolder = useSelector(({ notesState }) => notesState.activeFolder)

  const dispatch = useDispatch()

  const newNoteHandler = () => {
    const note = newNote(activeCategoryId, activeFolder)
    if ((activeNote && activeNote.text !== '') || !activeNote) {
      dispatch(addNote(note))
      dispatch(swapNote(note.id))
    }
  }

  const trashNoteHandler = () => {
    if (activeNote && !activeNote.trash) {
      dispatch(sendNoteToTrash(activeNote.id))
    }
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote)
    }
  }

  const syncNotesHandler = () => {
    postState(notes, categories)
  }

  useKey('alt+k', () => {
    newNoteHandler()
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
  return null

  // return (
  //   <nav className='navigation'>
  //     <button className='nav-button' onClick={newNoteHandler}><Plus /> New Note
  //     </button>
  //     <div
  //       className='nav-button'
  //       onClick={trashNoteHandler}
  //     >
  //       <X /> Delete Note
  //     </div>
  //     <div
  //       className='nav-button'
  //       onClick={downloadNoteHandler}
  //     >
  //       <Download /> Download Note
  //     </div>
  //     <div
  //       className='nav-button'
  //       onClick={syncNotesHandler}
  //     >
  //       <Cloud />
  //       Sync notes
  //       {syncing && 'Syncing...'}
  //     </div>
  //   </nav>
  // )
}

export default KeyboardShortcuts