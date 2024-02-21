import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { AppDispatch } from '../store'
import { addCategory, deleteCategory } from 'store/slices/categorySlice'
import { CategoryItem, NoteItem } from 'type'
import { pruneCategoryFromNotes, swapCategory, swapFolder, swapNote } from 'store/slices/noteSlice'
import { Folders } from '../constants/codeMirrorOptions'
import { Book, Folder, Trash2 } from 'react-feather'

const AppSidebar = () => {

  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)
  const activeFolder = useSelector(({ notesState }) => notesState.activeFolder)

  const dispatch: AppDispatch = useDispatch()

  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [tempCategory, setTempCategory] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>): void => {
    event.preventDefault()
    const category = {
      id: kebabCase(tempCategory),
      name: tempCategory,
    }
    if (!categories.find(cat => cat.id === kebabCase(tempCategory))) {
      dispatch(addCategory(category))
      setTempCategory('')
      setAddingTempCategory(false)
    }


  }


  return (
    <aside className='app-sidebar'>
      <section id='app-sidebar-main'>
        <div onClick={() => {
          dispatch(swapFolder(Folders.ALL))
        }} className={activeFolder === Folders.ALL ? 'app-sidebar-link active' : 'app-sidebar-link'}>
          <Book size={15} style={{ marginRight: '.5rem' }} />
          Notes
        </div>
        <div
          className={
            activeFolder === Folders.TRASH ? 'app-sidebar-link active' : 'app-sidebar-link'
          }
          onClick={() => {
            dispatch(swapFolder(Folders.TRASH))
          }}
        >

          <Trash2 size={15} style={{ marginRight: '.5rem' }} />
          Trash
        </div>
        <div className='category-title vbetween'>
          <h2>Categories</h2>
          <button onClick={newTempCategoryHandler} className='add-button'>
            +
          </button>
        </div>

        <div className='category-list'>
          {categories.map(category => {
            return (
              <div key={category.id}
                   className={category.id === activeCategoryId ? 'category-each active' : 'category-each'}
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
              >
                <div className='category-each-name'>
                  <Folder size={15} style={{ marginRight: '.5rem' }} />
                  {category.name}
                </div>

                <div
                  className='category-options'
                  onClick={() => {
                    const newNoteId = notes.length > 0 ? notes[0].id : ''
                    dispatch(deleteCategory(category.id))
                    dispatch(pruneCategoryFromNotes(category.id))
                    dispatch(swapCategory(Folders.ALL))
                    dispatch(swapFolder(Folders.ALL))
                    dispatch(swapNote(newNoteId))
                  }}
                >

                  X
                </div>
              </div>
            )
          })}
        </div>
        {addingTempCategory && (
          <form
            className='add-category-form'
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
                if (!tempCategory) {
                  setAddingTempCategory(false)
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