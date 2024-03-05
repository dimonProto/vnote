import React from 'react'
import { NoteItem } from '../type'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'

import { toggleFavoriteNote, toggleTrashedNote } from '../store/slices/noteSlice'
import { downloadNote, getNoteTitle } from '../helpers'
import { ArrowUp, Bookmark, Download, Trash } from 'react-feather'

interface NoteOptionsProps {
  clickedNote: NoteItem
}

const NoteOptions: React.FC<NoteOptionsProps> = ({ clickedNote }) => {

  const dispatch: AppDispatch = useDispatch()

  const trashNoteHandler = () => {
    if (clickedNote) {
      dispatch(toggleTrashedNote(clickedNote.id))
    }
  }
  const favoriteNoteHandler = () => {
    dispatch(toggleFavoriteNote(clickedNote.id))
  }

  const downloadNoteHandler = () => {
    if (clickedNote) {
      downloadNote(getNoteTitle(clickedNote.text), clickedNote)
    }
  }


  return (
    <nav className='note-options-nav'>
      {!clickedNote.trash && (
        <div className='nav-button' onClick={favoriteNoteHandler}>
          <Bookmark size={15} />
          {clickedNote.favorite ? 'Remove Favorite' : 'Mark is Favorite'}
        </div>
      )}
      <div className='nav-button' onClick={trashNoteHandler}>
        {clickedNote.trash ? (
          <>
            <ArrowUp size={15} />
            Restore from trash
          </>
        ) : (
          <>
            <Trash size={15} />
            Move to trash
          </>
        )}
      </div>
      <div className='nav-button' onClick={downloadNoteHandler}>
        <Download size={15} />
        Download
      </div>

    </nav>
  )
}

export default NoteOptions