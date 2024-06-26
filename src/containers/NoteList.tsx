import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'store'
import { addCategoryToNote, emptyTrash, pruneNote, searchNotes, swapCategory, swapNote } from 'store/slices/noteSlice'
import { getNoteTitle, sortByFavourites, sortByLastUpdated } from '../helpers'
import { CategoryItem, NoteItem, ReactDragEvent, ReactMouseEvent } from '../type'
import { Folders } from '../constants'
import NoteOptions from './NoteOptions'
import { MoreHorizontal, Star } from 'react-feather'
import _ from 'lodash'
import NoteListButton from '../componets/NoteListButton'


const NoteList = () => {

  const activeCategoryId = useSelector(({ notesState }) => notesState.activeCategoryId)
  const activeFolder: Folders = useSelector(({ notesState }) => notesState.activeFolder)
  const searchValue = useSelector(({ notesState }) => notesState.searchValue)
  const activeNoteId = useSelector((state: RootState) => state.notesState.activeNoteId)
  const [noteOptionsPosition, setNoteOptionsPosition] = useState({ x: 0, y: 0 })


  const re = new RegExp(_.escapeRegExp(searchValue), 'i')
  const isMatch = (result: NoteItem) => re.test(result.text)

  const filter: Record<Folders, (note: NoteItem) => boolean> = {
    [Folders.CATEGORY]: note => !note.trash && note.category === activeCategoryId,
    [Folders.FAVORITES]: note => !note.trash && !!note.favorite,
    [Folders.TRASH]: note => !!note.trash,
    [Folders.ALL]: note => !note.trash,
  }


  const filteredNotes: NoteItem[] = useSelector(
    ({ notesState }: RootState) => notesState.notes.filter(filter[activeFolder])
      .filter(isMatch)
      .sort(sortByLastUpdated).sort(sortByFavourites),
  )

  const filteredCategories: CategoryItem[] = useSelector(({
                                                            categoryState,
                                                            notesState,
                                                          }: RootState) => categoryState.categories.filter(
    category => category.id !== notesState.activeCategoryId))

  const dispatch: AppDispatch = useDispatch()

  const _searchNotes = _.debounce((searchValue: string) => dispatch(searchNotes(searchValue)), 200)

  const [noteOptionsId, setNoteOptionsId] = useState('')
  const node = useRef<HTMLDivElement>(null)

  const handleNoteOptionsClick = (event: ReactMouseEvent, noteId: string = '') => {

    if (event instanceof MouseEvent && (event.target instanceof Element || event.target instanceof SVGElement)) {

      if (event.target.classList.contains('note-options')) {
        setNoteOptionsPosition({ x: event.pageX, y: event.pageY })
      }
      if (event.target.parentElement instanceof Element) {
        if (event.target.parentElement.classList.contains('note-options')) {
          setNoteOptionsPosition({ x: event.pageX, y: event.pageY })
        }
      }
    }

    event.stopPropagation()

    if (node.current && node.current.contains(event.target as HTMLDivElement)) return
    setNoteOptionsId(!noteOptionsId || noteOptionsId !== noteId ? noteId : '')

  }

  const getOptionsYPosition = () => {
    const MaxY = window.innerHeight

    // determine approximate options height based on root font-size of 15px, padding, and select box.
    const optionsSize = 15 * 11

    return MaxY - noteOptionsPosition.y > optionsSize
      ? noteOptionsPosition.y
      : noteOptionsPosition.y - optionsSize
  }


  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleNoteOptionsClick)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleNoteOptionsClick)
    }
  })

  const handleDragStart = (event: ReactDragEvent, noteId: string = '') => {
    event.stopPropagation()
    event.dataTransfer.setData('text/plain', noteId)
  }

  const showEmptyTrash = activeFolder === Folders.TRASH && filteredNotes.length > 0

  return (
    <aside className='note-sidebar'>
      <div className='note-sidebar-header'>
        <input type='search'
               placeholder='Search for notes'
               onChange={event => {
                 event.preventDefault()
                 dispatch(searchNotes(event.target.value))
               }}
        />
        {showEmptyTrash && (
          <NoteListButton handler={() => dispatch(emptyTrash())} label="Empty Trash">
            Empty Trash
          </NoteListButton>
        )}
      </div>
      <div className='note-list'>
        {filteredNotes.map(note => {
          let noteTitle: string | React.ReactElement = getNoteTitle(note.text)

          if (searchValue) {
            const highlightStart = noteTitle.search(re)

            if (highlightStart !== -1) {
              const highlightEnd = highlightStart + searchValue.length

              noteTitle = (
                <>
                  {noteTitle.slice(0, highlightStart)}
                  <strong className='highlighted'>
                    {noteTitle.slice(highlightStart, highlightEnd)}
                  </strong>
                  {noteTitle.slice(highlightEnd)}
                </>
              )
            }

          }

          return (
            <div
              key={note.id}

              className={note.id === activeNoteId ? 'note-list-each active' : 'note-list-each'}
              onClick={() => {
                if (note.id !== activeNoteId) {
                  dispatch(swapNote(note.id))
                  dispatch(pruneNote())
                }

              }}
              draggable
              onDragStart={event => handleDragStart(event, note.id)}
            >
              <div className='note-title'>
                {note.favorite ? (
                  <>
                    <div className='icon'>
                      <Star className='note-favorite' size={12} />
                    </div>
                    <div> {noteTitle}</div>
                  </>
                ) : (
                  <>
                    <div className='icon'></div>
                    <div> {noteTitle}</div>
                  </>
                )}
              </div>
              <div className={noteOptionsId === note.id ? 'note-options active' : 'note-options'}
                   onClick={event => handleNoteOptionsClick(event, note.id)}
              >
                <MoreHorizontal size={15} />
              </div>
              {note.favorite && <span>⭐</span>}
              {noteOptionsId === note.id && (
                <div ref={node}
                     className='note-options-context-menu'
                     style={{
                       position: 'absolute',
                       top: getOptionsYPosition() + 'px',
                       left: noteOptionsPosition.x + 'px',
                     }}
                     onClick={event => event.stopPropagation()}
                >
                  {!note.trash && filteredCategories.length > 0 && (
                    <>

                      <select
                        defaultValue=''
                        className='select'
                        onChange={event => {
                          dispatch(addCategoryToNote({ noteId: note.id, categoryId: event.target.value }))

                          if (event.target.value !== activeCategoryId) {
                            dispatch(swapCategory(event.target.value))
                            dispatch(swapNote(note.id))
                          }

                          setNoteOptionsId('')
                        }}
                      >
                        <option disabled value=''>
                          Move to category...
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
                    </>
                  )}
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