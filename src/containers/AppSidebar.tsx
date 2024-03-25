import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { AppDispatch, RootState } from '../store'
import { addCategory, deleteCategory, updateCategory } from 'store/slices/categorySlice'
import { CategoryItem, NoteItem, ReactDragEvent, ReactSubmitEvent } from 'type'
import {
  addCategoryToNote,
  addNote,
  pruneCategoryFromNotes,
  swapCategory,
  swapFolder,
  swapNote,
  toggleFavoriteNote,
  toggleTrashedNote,
} from 'store/slices/noteSlice'
import { Folders } from '../constants/codeMirrorOptions'
import { Book, Bookmark, Folder, Plus, Settings, Trash2, UploadCloud, X } from 'react-feather'
import { postState } from '../store/middleware'
import { newNote } from '../helpers'
import { useTempState } from '../context/TempStateProvider'
import { toggleSettingsModal } from '../store/slices/settingsSlice'


const iconColor = 'rgba(255, 255, 255, 0.25)'

const AppSidebar = () => {

  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const activeFolder = useSelector(({ notesState }) => notesState.activeFolder)
  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))


  const dispatch: AppDispatch = useDispatch()

  const {
    addingTempCategory,
    setAddingTempCategory,
    errorCategoryMessage,
    setErrorCategoryMessage,
  } = useTempState()

  const [tempCategory, setTempCategory] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const settingsHandler = () => {
    dispatch(toggleSettingsModal())
  }

  const newNoteHandler = () => {

    if (activeFolder === Folders.TRASH) {
      dispatch(swapFolder(Folders.ALL))
    }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      const note = newNote(
        activeCategoryId,
        activeFolder === Folders.TRASH ? Folders.ALL : activeFolder,
      )
      dispatch(addNote(note))
      dispatch(swapNote(note.id))
    }
  }

  const syncNotesHandler = () => {
    postState(notes, categories)
  }

  const resetTempCategory = () => {
    setTempCategory('')
    setAddingTempCategory(false)
    setErrorCategoryMessage('')
  }

  const onSubmit = (event: ReactSubmitEvent): void => {
    event.preventDefault()

    const category = {
      id: kebabCase(tempCategory),
      name: tempCategory,
    }

    if (category.name.length > 20) {
      setErrorCategoryMessage('Category name must not exceed 20 characters')
    } else if (categories.find(cat => cat.id === kebabCase(tempCategory))) {
      setErrorCategoryMessage('Category name has already been added')
    } else {
      dispatch(addCategory(category))
      resetTempCategory()
    }
  }

  const allowDrop = (event: ReactDragEvent) => {
    event.preventDefault()
  }

  const trashNoteHandler = (event: ReactDragEvent) => {
    event.preventDefault()
    dispatch(toggleTrashedNote(event.dataTransfer.getData('text')))
  }

  const favoriteNoteHandler = (event: ReactDragEvent) => {
    event.preventDefault()
    dispatch(toggleFavoriteNote(event.dataTransfer.getData('text')))
  }


  return (
    <aside className='app-sidebar'>
      <section className='app-sidebar-actions'>
        <>
          <button className='action-button' aria-label='create new note' onClick={newNoteHandler}>
              <span>
                <Plus
                  size={18}
                  className='action-button-icon'
                  color={iconColor}
                  aria-hidden='true'
                  focusable='false'
                />
              </span>
          </button>
        </>
        <button className='action-button' aria-label='create new note' onClick={syncNotesHandler}>
              <span>
                <UploadCloud
                  size={18}
                  className='action-button-icon'
                  color={iconColor}
                  aria-hidden='true'
                  focusable='false'
                />
              </span>
        </button>
        <button className='action-button' aria-label='create new note' onClick={settingsHandler}>
              <span>
                <Settings
                  size={18}
                  className='action-button-icon'
                  color={iconColor}
                  aria-hidden='true'
                  focusable='false'
                />
              </span>
        </button>
      </section>
      <section className='app-sidebar-main'>
        <div
          className={activeFolder === Folders.ALL ? 'app-sidebar-link active' : 'app-sidebar-link'}
          onClick={() => {
            dispatch(swapFolder(Folders.ALL))
          }}
        >

          <Book size={15} className='app-sidebar-icon' color={iconColor} />
          All Notes
        </div>
        <div
          className={activeFolder === Folders.FAVORITES ? 'app-sidebar-link active' : 'app-sidebar-link'}
          onClick={() => dispatch(swapFolder(Folders.FAVORITES))}
          onDrop={favoriteNoteHandler}
          onDragOver={allowDrop}
        >
          <Bookmark size={15} className='app-sidebar-icon' color={iconColor} />
          Favorites
        </div>
        <div
          className={
            activeFolder === Folders.TRASH ? 'app-sidebar-link active' : 'app-sidebar-link'
          }
          onClick={() => {
            dispatch(swapFolder(Folders.TRASH))
          }}
          onDrop={trashNoteHandler}
          onDragOver={allowDrop}
        >

          <Trash2 size={15} style={{ marginRight: '.75rem' }} color={iconColor} />
          Trash
        </div>
        <div className='category-title v-between'>
          <h2>Categories</h2>
          <button className='category-button' onClick={newTempCategoryHandler}>
            <Plus size={15} color={iconColor} />
          </button>
        </div>

        <div className='category-list'>
          {errorCategoryMessage && (
            <div className='category-error-message'>{errorCategoryMessage} </div>
          )}
          {categories.map(category => {
            return (
              <div key={category.id}
                   className={`category-list-each ${category.id === activeCategoryId ? 'active' : ''}`}
                   onClick={() => {
                     const notesForNewCategory = notes.filter(
                       note => note.category === category.id,
                     )
                     const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                     if (category.id !== activeCategoryId) {
                       dispatch(swapCategory(category.id))
                       dispatch(swapNote(newNoteId))
                     }
                   }}
                   onDoubleClick={() => {
                     setEditingCategoryId(category.id)
                   }}
                   onBlur={() => {
                     setEditingCategoryId('')
                   }}
                   onDrop={event => {
                     event.preventDefault()
                     dispatch(addCategoryToNote({
                       noteId: category.id,
                       categoryId: event.dataTransfer.getData('text'),
                     }))
                   }}
                   onDragOver={allowDrop}
              >
                <form
                  className='category-list-name'
                  onSubmit={e => {
                    setEditingCategoryId('')
                    e.preventDefault()
                  }}
                >
                  <Folder size={15} className='app-sidebar-icon' color={iconColor} />
                  {editingCategoryId === category.id ? (
                    <input
                      value={category.name}
                      onChange={event => {
                        dispatch(updateCategory({ id: category.id, name: event.target.value }))
                      }}
                    />
                  ) : category.name
                  }
                </form>
                <div
                  className='category-options'
                  onClick={() => {
                    const noteNotTrash = notes.filter(note => !note.trash)
                    const newNoteId = noteNotTrash.length > 0 ? noteNotTrash[0].id : ''
                    dispatch(deleteCategory(category.id))
                    dispatch(pruneCategoryFromNotes(category.id))
                    dispatch(swapCategory(Folders.ALL))
                    dispatch(swapFolder(Folders.ALL))
                    dispatch(swapNote(newNoteId))
                  }}
                >

                  <X size={12} />
                </div>
              </div>
            )
          })}
        </div>
        {addingTempCategory && (
          <form
            className='category-form'
            action=''
            onSubmit={onSubmit}
          >
            <input
              autoFocus
              placeholder='New category...'
              onChange={event => {
                setTempCategory(event.target.value)
              }}
              onBlur={event => {
                if (!tempCategory || errorCategoryMessage) {
                  resetTempCategory()
                } else {
                  onSubmit(event)
                }
              }}
              type='text' />
          </form>
        )}
      </section>

    </aside>
  )
}

export default AppSidebar