import React from 'react'
import { addNote, deleteNote, swapNote, syncState } from 'store/slices/noteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { getNoteTitle } from 'helpers'

const Navigation = () => {
  const activeNote = useSelector(({ notesState }) => notesState.notes?.find(note => note.id === notesState.active))
  const notes = useSelector(({ notesState }) => notesState.notes)
  const syncing = useSelector(({ notesState }) => notesState.notes.syncing)
 

  const downloadNote = (fileName, text) => {
    const pom = document.createElement('a')
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    pom.setAttribute('download', `${fileName}.md`)

    if (document.createEvent) {
      const event = document.createEvent('MouseEvent')
      event.initEvent('click', true, true)
      pom.dispatchEvent(event)
    } else {
      pom.click()
    }
  }

  const dispatch = useDispatch()

  return (
    <nav className='navigation'>
      <button className='nav-button' onClick={async () => {
        const note = { id: uuidv4(), text: '', created: '', lastUpdated: '' }
        dispatch(await addNote(note))
        dispatch(swapNote(note.id))
      }}>+ New Note
      </button>
      <button
        className='nav-button'
        onClick={() => {
          if ((activeNote && activeNote.text !== '') || !activeNote) {
            dispatch(deleteNote(activeNote.id))
          }

        }}
      >
        X Delete Note
      </button>
      <button
        className='nav-button'
        onClick={() => {
          if (activeNote) {
            downloadNote(getNoteTitle(activeNote.text), activeNote.text)
          }
        }}
      >
        ^ Download Note
      </button>
      <button
        className='nav-button'
        onClick={() => {
          syncState(notes)
        }}
      >
        Sync notes
        {syncing && 'Syncing...'}
      </button>
    </nav>
  )
}

export default Navigation