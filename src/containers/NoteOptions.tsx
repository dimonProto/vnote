import React from 'react'
import { NoteItem } from '../type'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { deleteNote, toggleFavoriteNote, toggleTrashedNote } from '../store/slices/noteSlice'
import { downloadNote, getNoteTitle } from '../helpers'
import { ArrowUp, Download, Star, Trash, X } from 'react-feather'
import NoteOptionsButton from '../componets/NoteOptionsButton'

interface NoteOptionsProps {
  clickedNote: NoteItem
}

const NoteOptions: React.FC<NoteOptionsProps> = ({ clickedNote }) => {

  const dispatch: AppDispatch = useDispatch()


  const deleteNoteHandler = () => {
    dispatch(deleteNote(clickedNote.id))
  }


  const downloadNoteHandler = () => {
    if (clickedNote) {
      downloadNote(getNoteTitle(clickedNote.text), clickedNote)
    }
  }

  const favoriteNoteHandler = () => {
    dispatch(toggleFavoriteNote(clickedNote.id))
  }

  const trashNoteHandler = () => {
    dispatch(toggleTrashedNote(clickedNote.id))
  }

  return (
    <nav className='note-options-nav'>
      {clickedNote.trash ? (
        <>
          <NoteOptionsButton handler={deleteNoteHandler} icon={X} text='Delete permanently' />
          <NoteOptionsButton handler={trashNoteHandler} icon={ArrowUp} text='Restore from trash' />
        </>
      ) : (
        <>
          <NoteOptionsButton handler={favoriteNoteHandler} icon={Star}
                             text={clickedNote.favorite ? 'Remove favorite' : 'Mark as favorite'} />
          <NoteOptionsButton handler={trashNoteHandler} icon={Trash} text='Move to trash' />
        </>
      )}
      <NoteOptionsButton handler={downloadNoteHandler} icon={Download} text='Download' />
    </nav>
  )
}

export default NoteOptions