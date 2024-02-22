import React from 'react'
import { CategoryItem, NoteItem } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { addNote, sendNoteToTrash, swapNote } from '../store/slices/noteSlice'
import { downloadNote, getNoteTitle } from '../helpers'
import { postState } from '../store/middleware'
import { useKey } from '../helpers/hooks'
import { Download, Trash } from 'react-feather'

const NoteOptions: React.FC = () => {

  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const notes: NoteItem[] = useSelector((state: RootState) => state.notesState.notes)
  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)

  const dispatch: AppDispatch = useDispatch()

  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuidv4(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
      category: activeCategoryId ? activeCategoryId : '',
    }
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

  return (
    <nav className='note-options-nav'>
      <div className='nav-button' onClick={trashNoteHandler}>
        <Trash size={15} />
        Delete note
      </div>
      <div className='nav-button' onClick={downloadNoteHandler}>
        <Download size={15} />
        Download note
      </div>

    </nav>
  )
}

export default NoteOptions