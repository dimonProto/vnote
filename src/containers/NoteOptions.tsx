import React from 'react'
import { NoteItem } from '../type'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { deleteNote, toggleFavoriteNote, toggleTrashedNote } from '../store/slices/noteSlice'
import { downloadNote, getNoteTitle } from '../helpers'
import { ArrowUp, Bookmark, Download, Trash, X } from 'react-feather'

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
          <div className='nav-button' onClick={deleteNoteHandler}>
            <X size={15} />
            Delete permanently
          </div>
          <div className='nav-button' onClick={trashNoteHandler}>
            <ArrowUp size={15} />
            Restore from trash
          </div>
        </>
      ) : (
        <>
          <div className='nav-button' onClick={favoriteNoteHandler}>
            <Bookmark size={15} />
            {clickedNote.favorite ? 'Remove Favorite' : 'Mark as Favorite'}
          </div>
          <div className='nav-button' onClick={trashNoteHandler}>
            <Trash size={15} />
            Move to trash
          </div>
        </>
      )}
      <div className='nav-button' onClick={downloadNoteHandler}>
        <Download size={15} />
        Download
      </div>

    </nav>
  )
}

export default NoteOptions