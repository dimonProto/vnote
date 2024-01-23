import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { swapNote } from 'store/slices/noteSlice'


const NoteList = () => {

  const notes = useSelector((state: RootState) => state.notesState.data)
  const dispatch: AppDispatch = useDispatch()


  return (
    <aside className='sidebar'>
      <div className='note-list'>
        {notes.map(note => {
          const noteTitle = note?.text?.indexOf('\n') !== -1 ? note.text.slice(0, note.text.indexOf('\n')) : note.text.slice(0, 50)
          return (
            <div key={note.id} className='note-title' onClick={() => dispatch(swapNote(note.id))}>
              {noteTitle}
            </div>
          )
        })}
      </div>

    </aside>
  )
}

export default NoteList