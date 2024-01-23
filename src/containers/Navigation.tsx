import React from 'react'
import { addNote, deleteNote, swapNote } from 'store/slices/noteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

const Navigation = () => {

  const activeNote = useSelector(({ notesState }) => notesState.data?.find(note => note.id === notesState.active))


  const dispatch = useDispatch()
  return (
    <nav className='navigation'>
      <button className='nav-button' onClick={() => {
        const note = { id: uuidv4(), text: '', created: '', lastUpdated: '' }
        dispatch(addNote(note))
        dispatch(swapNote(note.id))
      }}>+ New Note
      </button>
      <button
        className='nav-button'
        onClick={() => {
          if (activeNote) {
            dispatch(deleteNote(activeNote.id))
          }

        }}
      >
        X Delete Note
      </button>
    </nav>
  )
}

export default Navigation