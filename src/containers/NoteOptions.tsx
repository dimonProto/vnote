import React from 'react'
import { NoteItem } from '../type'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'
import { deleteNote, toggleFavoriteNote, toggleTrashedNote } from '../store/slices/noteSlice'
import { downloadNote, getNoteTitle } from '../helpers'
import { ArrowUp, Download, Star, Trash, X } from 'react-feather'

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
          <div className='nav-item' onClick={deleteNoteHandler}>
            <X size={18} />
            Delete permanently
          </div>
          <div className='nav-item' onClick={trashNoteHandler}>
            <ArrowUp size={18} />
            Restore from trash
          </div>
        </>
      ) : (
        <>
          <div className='nav-item' onClick={favoriteNoteHandler}>
            <Star size={18} />
            {clickedNote.favorite ? 'Remove favorite' : 'Mark as favorite'}
          </div>
          <div className='nav-item' onClick={trashNoteHandler}>
            <Trash size={18} />
            Move to trash
          </div>
        </>
      )}
      <div className='nav-item' onClick={downloadNoteHandler}>
        <Download size={18} />
        Download
      </div>

    </nav>
  )
}

export default NoteOptions