import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { pruneNote, swapNote } from 'store/slices/noteSlice'


const NoteList = () => {

  const notes = useSelector((state: RootState) => state.notesState.notes)
  const active = useSelector((state: RootState) => state.notesState.active)
  const dispatch: AppDispatch = useDispatch()


  return (
    <aside className='sidebar'>
      <div className='note-list'>
        {notes.map(note => {
          let noteTitle: string
          if (!note.text) {
            noteTitle = 'New Note'
          } else if (note.text.indexOf('\n') !== -1) {
            noteTitle = note.text.slice(0, note.text.indexOf('\n'))
          } else {
            noteTitle = note.text.slice(0, 50)
          }
          return (
            <div key={note.id} className={note.id === active ? 'note-title active' : 'note-title'}
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