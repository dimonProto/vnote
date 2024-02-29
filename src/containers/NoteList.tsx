import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { addCategoryToNote, pruneNote, swapCategory, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle, sortByLastUpdated } from '../helpers'
import { CategoryItem, NoteItem } from '../type'
import { Folders } from '../constants/codeMirrorOptions'
import NoteOptions from './NoteOptions'
import { MoreHorizontal } from 'react-feather'


const NoteList = () => {

  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const activeFolder: Folders = useSelector(({ notesState }) => notesState.activeFolder)
  const activeCategory = useSelector(({ categoryState, notesState }: RootState) => categoryState.categories.find(
    category => category.id === notesState.activeCategoryId))
  const activeNoteId = useSelector((state: RootState) => state.notesState.activeNoteId)
  const filteredNotes: NoteItem[] = useSelector(({
                                                   notesState,
                                                 }: RootState) => {
      let filterNotes: NoteItem[]

      if (notesState.activeFolder === Folders.CATEGORY) {

        filterNotes = notesState.notes.filter(
          note => !note.trash && note.category === notesState.activeCategoryId)
      } else if (notesState.activeFolder === Folders.FAVORITES) {
        filterNotes = notesState.notes.filter(note => !note.trash && note.favorite)
      } else if (notesState.activeFolder === Folders.TRASH) {
        filterNotes = notesState.notes.filter(note => note.trash)
      } else {
        filterNotes = notesState.notes.filter(note => !note.trash)
      }

      filterNotes.sort(sortByLastUpdated)
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


  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleNoteOptionsClick)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleNoteOptionsClick)
    }
  })

  return (
    <aside className='note-sidebar'>
      <div className='note-sidebar-header'>
        {activeFolder === 'CATEGORY' ? activeCategory && activeCategory.name : Folders[activeFolder]}
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
                <MoreHorizontal size={15} />
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
                  <NoteOptions clickedNote={note} />
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