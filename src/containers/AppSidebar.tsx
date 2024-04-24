import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { Folders, iconColor } from '../constants'
import { Book, Folder, Loader, Plus, Settings, Star, Trash2, UploadCloud, X } from 'react-feather'
import { postState } from '../store/middleware'
import { newNote } from '../helpers'
import { useTempState } from '../context/TempStateProvider'
import { toggleSettingsModal } from '../store/slices/settingsSlice'
import AppSidebarAction from '../componets/AppSidebarAction'
import { v4 as uuidv4 } from 'uuid'

const AppSidebar = () => {

  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const activeFolder = useSelector(({ notesState }) => notesState.activeFolder)
  const { syncing } = useSelector((state: RootState) => state.syncState)
  const activeNote: NoteItem | undefined = useSelector(({ notesState }: RootState) => notesState.notes?.find(note => note.id === notesState.activeNoteId))


  const dispatch: AppDispatch = useDispatch()

  const { setErrorCategoryMessage, addingTempCategory, setAddingTempCategory } = useTempState()

  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [tempCategoryName, setTempCategoryName] = useState('')

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
    setTempCategoryName('')
    setAddingTempCategory(false)
    setErrorCategoryMessage('')
    setEditingCategoryId('')
  }

  const onSubmitNewCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault()

    const category = {
      id: uuidv4(),
      name: tempCategoryName.trim(),
    }

    if (categories.find(cat => cat.name === category.name) || category.name === '') {
      resetTempCategory()
    } else {
      dispatch(addCategory(category))
      resetTempCategory()
    }
  }

  const onSubmitUpdateCategory = (event: ReactSubmitEvent): void => {
    event.preventDefault()

    const category = { id: editingCategoryId, name: tempCategoryName.trim() }

    if (categories.find(cat => cat.name === category.name) || category.name === '') {
      resetTempCategory()
    } else {
      dispatch(updateCategory({ id: category.id, name: category.name }))
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

        {activeFolder !== Folders.TRASH && (
          <AppSidebarAction icon={Plus} label='create new note' handler={newNoteHandler} />
        )}

        <AppSidebarAction
          handler={syncNotesHandler}
          icon={syncing ? Loader : UploadCloud}
          label='Sync notes'
        />
        <AppSidebarAction handler={settingsHandler} icon={Settings} label='Settings' />

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
          <Star size={15} className='app-sidebar-icon' color={iconColor} />
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
                     setTempCategoryName(category.name)
                   }}
                   onBlur={() => {
                     setEditingCategoryId('')
                   }}
                   onDrop={event => {
                     event.preventDefault()
                     dispatch(addCategoryToNote({
                       categoryId: category.id,
                       noteId: event.dataTransfer.getData('text'),
                     }))
                   }}
                   onDragOver={allowDrop}
              >
                <form
                  className='category-list-name'
                  onSubmit={event => {
                    event.preventDefault()
                    setEditingCategoryId('')
                    onSubmitUpdateCategory(event)
                  }}
                >
                  <Folder size={15} className='app-sidebar-icon' color={iconColor} />
                  {editingCategoryId === category.id ? (
                    <input
                      type='text'
                      autoFocus
                      maxLength={20}
                      className='category-edit'
                      value={tempCategoryName}
                      onChange={event => {
                        setTempCategoryName(event.target.value)
                      }}
                      onBlur={event => {
                        resetTempCategory()
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
            onSubmit={onSubmitNewCategory}
          >
            <input
              autoFocus
              type='text'
              maxLength={20}
              placeholder='New category...'
              onChange={event => {
                setTempCategoryName(event.target.value)
              }}
              onBlur={event => {
                if (!tempCategoryName || tempCategoryName.trim() === '') {
                  resetTempCategory()
                } else {
                  onSubmitNewCategory(event)
                }
              }}
            />
          </form>
        )}
      </section>

    </aside>
  )
}

export default AppSidebar