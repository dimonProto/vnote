import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { pruneNote, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle } from '../helpers'


const NoteList = () => {

  const notes = useSelector((state: RootState) => state.notesState.notes)
  const active = useSelector((state: RootState) => state.notesState.active)
  const dispatch: AppDispatch = useDispatch()


  return (
    <aside className='note-sidebar'>
      <div className='note-list'>
        {notes.map(note => {
          const noteTitle = getNoteTitle(note.text)
          return (
            <div key={note.id} className={note.id === active ? 'note-each active' : 'note-each'}
                 onClick={() => {
                   if (note.id !== active) {
                     dispatch(swapNote(note.id))
                     dispatch(pruneNote())
                   }
                 }}>
              {noteTitle}
            </div>
          )
        })}
      </div>

    </aside>
  )
}

export default NoteList