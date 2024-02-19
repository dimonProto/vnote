import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { addCategoryToNote, pruneNote, swapCategory, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle } from '../helpers'
import { CategoryItem, NoteItem } from '../type'
import { Folders } from '../constants/codeMirrorOptions'


const NoteList = () => {

  const notes: NoteItem[] = useSelector((state: RootState) => state.notesState.notes)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const activeNoteId = useSelector((state: RootState) => state.notesState.activeNoteId)
  const filteredNotes: NoteItem[] = useSelector(({
                                                   notesState,
                                                 }: RootState) => {
      let filterNotes: NoteItem[] = []
      if (notesState.activeNoteId === Folders.CATEGORY) {
        filterNotes = notesState.notes.filter(note => note.category === notesState.activeCategoryId)
      } else if (notesState.activeFolder === Folders.TRASH) {
        filterNotes = notesState.notes.filter(note => note.trash)
      } else {
        filterNotes = notesState.notes.filter(note => !note.trash)

      }
      return filterNotes
    },
  )
  console.log(filteredNotes)
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
      <div className='note-list'>
        {filteredNotes.map(note => {
          const noteTitle: string = getNoteTitle(note.text)
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
                      const notesForNewCategory = notes.filter(note => note.category === event.target.value)
                      const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                      if (event.target.value !== activeCategoryId) {
                        dispatch(swapCategory(event.target.value))
                        dispatch(swapNote(newNoteId))
                      }
                      handleNoteOptionsClick(event)
                    }}
                    name='' id=''>
                    <option disabled value=''>
                      Select category
                    </option>
                    {filteredCategories.map(category => (
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