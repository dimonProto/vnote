import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { addCategoryToNote, addNote, pruneNote, swapCategory, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle } from '../helpers'
import { CategoryItem, NoteItem } from '../type'
import { Folders } from '../constants/codeMirrorOptions'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { PlusCircle } from 'react-feather'
import NoteOptions from './NoteOptions'


const NoteList = () => {

  const notes: NoteItem[] = useSelector((state: RootState) => state.notesState.notes)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const activeNoteId = useSelector((state: RootState) => state.notesState.activeNoteId)
  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))
  const filteredNotes: NoteItem[] = useSelector(({
                                                   notesState,
                                                 }: RootState) => {
      let filterNotes: NoteItem[] = []

      if (notesState.activeFolder === Folders.CATEGORY) {
        console.log('ss')
        filterNotes = notesState.notes.filter(
          note => !note.trash && note.category === notesState.activeCategoryId)
      } else if (notesState.activeFolder === Folders.TRASH) {
        filterNotes = notesState.notes.filter(note => note.trash)
      } else {
        filterNotes = notesState.notes.filter(note => !note.trash)

      }
      return filterNotes
    },
  )

  const filteredCategories: CategoryItem[] = useSelector(({
                                                            categoryState,
                                                            notesState,
                                                          }: RootState) => categoryState.categories.filter(
    category => category.id !== notesState.activeCategoryId))

  const dispatch: AppDispatch = useDispatch()
  const [noteOptionsId, setNoteOptionsId] = useState('')
  const node = useRef<HTMLDivElement>(null)

  const handleNoteOptionsClick = (event: MouseEvent | React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLSelectElement>, noteId: string = '') => {
    event.stopPropagation()

    if (node.current) {
      if (node.current.contains(event.target as HTMLDivElement)) return
    }
    if (!noteOptionsId) {
      setNoteOptionsId(noteId)
    }
    if (noteOptionsId !== noteId) {
      setNoteOptionsId(noteId)
    } else {
      setNoteOptionsId('')
    }

  }

  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuidv4(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
      category: activeCategoryId ? activeCategoryId : '',
    }
    if ((activeNote && activeNote.text !== '') || !activeNote) {
      dispatch(addNote(note))
      dispatch(swapNote(note.id))
    }
  }

  const searchNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredResult = filteredNotes.filter(note => note.text.toLowerCase().search(event.target.value.toLowerCase()) !== -1)
  }
  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleNoteOptionsClick)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleNoteOptionsClick)
    }
  }, [])

  return (
    <aside className='note-sidebar'>
      {/* <input
        type="search"
        placeholder="Search notes"
        onChange={searchNotes}
        className="searchbar"
      /> */}
      <div className='add-note'>
        <div>
          <PlusCircle size={20} onClick={newNoteHandler} />
        </div>
      </div>
      <div className='note-list'>
        {filteredNotes.map(note => {
          const noteTitle = getNoteTitle(note.text)
          return (
            <div
              key={note.id}

              className={note.id === activeNoteId ? 'note-each active' : 'note-each'}
              onClick={() => {
                if (note.id !== activeNoteId) {
                  dispatch(swapNote(note.id))
                  dispatch(pruneNote())
                }

              }}
            >
              <div>{noteTitle}</div>
              <div className={noteOptionsId === note.id ? 'note-options active' : 'note-options'}
                   onClick={event => handleNoteOptionsClick(event, note.id)}
              >
                ...
              </div>
              {noteOptionsId === note.id && (
                <div ref={node}
                     className='note-options-context'
                     onClick={event => event.stopPropagation()}
                >
                  <h2>Move to category</h2>
                  <select
                    defaultValue=''
                    className='select-element'
                    onChange={event => {
                      dispatch(addCategoryToNote({ noteId: note.id, categoryId: event.target.value }))

                      if (event.target.value !== activeCategoryId) {
                        dispatch(swapCategory(event.target.value))
                        dispatch(swapNote(note.id))
                      }

                      setNoteOptionsId('')
                    }}
                    name='' id=''>
                    <option disabled value=''>
                      Select category
                    </option>
                    {filteredCategories
                      .filter(category => category.id !== note.category)
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    {note.category && (
                      <option key='none' value=''>
                        Remove category
                      </option>
                    )}
                  </select>
                  <NoteOptions />
                </div>
              )}
            </div>
          )
        })}
      </div>

    </aside>
  )
}

export default NoteList