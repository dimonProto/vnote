import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { pruneNote, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle } from '../helpers'
import { NoteItem } from '../type'


const NoteList = () => {

  const notes: NoteItem[] = useSelector((state: RootState) => state.notesState.notes)
  const activeNoteId = useSelector((state: RootState) => state.notesState.activeNoteId)
  const dispatch: AppDispatch = useDispatch()


  return (
    <aside className='note-sidebar'>
      <div className='note-list'>
        {notes.map(note => {
          const noteTitle = getNoteTitle(note.text)
          return (
            <div key={note.id} className={note.id === activeNoteId ? 'note-each active' : 'note-each'}
                 onClick={() => {
                   if (note.id !== activeNoteId) {
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