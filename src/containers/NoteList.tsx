import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { addCategoryToNote, pruneNote, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle } from '../helpers'
import { CategoryItem, NoteItem } from '../type'
import { swapCategory } from '../store/slices/categorySlice'


const NoteList = () => {

  const notes: NoteItem[] = useSelector((state: RootState) => state.notesState.notes)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const activeNoteId = useSelector((state: RootState) => state.notesState.activeNoteId)
  const filteredNotes: NoteItem[] = useSelector(({
                                                   categoryState,
                                                   notesState,
                                                 }: RootState) => categoryState.activeCategoryId ?
    notesState.notes.filter(note => note.category === categoryState.activeCategoryId) : notesState.notes,
  )
  const filteredCategories: CategoryItem[] = useSelector(({ categoryState }: RootState) => categoryState.categories.filter(
    category => category.id !== categoryState.activeCategoryId))

  const dispatch: AppDispatch = useDispatch()

  const [noteOptionsId, setNoteOptionsId] = useState('')
  const node = useRef<HTMLDivElement>(null)

  const handleNoteOptionsClick = (event: MouseEvent | React.MouseEvent<HTMLDivElement>, noteId: string = '') => {
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