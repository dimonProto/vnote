import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { AppDispatch } from '../store'
import { addCategory, swapCategory } from 'store/slices/categorySlice'
import { CategoryItem, NoteItem } from 'type'
import { swapNote } from 'store/slices/noteSlice'

const AppSidebar = () => {

  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)
  const notes: NoteItem[] = useSelector(({ notesState }) => notesState.notes)

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

    dispatch(addCategory(category))
    setTempCategory('')
    setAddingTempCategory(false)
  }


  return (
    <aside className='app-sidebar'>
      <section id='app-sidebar-main'>
        <div onClick={() => {
          const newNoteId = notes.length > 0 ? notes[0].id : ''
          dispatch(swapCategory(''))
          dispatch(swapNote(newNoteId))
        }} className='app-sidebar-link'>
          Notes
        </div>
        <h2>Categories</h2>
        <div className='category-list'>
          {categories.map(category => {
            return (
              <div key={category.id}
                   className={category.id === activeCategoryId ? 'category-each active' : 'category-each'}
                   onClick={() => {
                     const notesForNewCategory = notes.filter(note => note.category === category.id)
                     const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''

                     if (category.id !== activeCategoryId) {
                       dispatch(swapCategory(category.id))
                       dispatch(swapNote(newNoteId))
                     }
                   }}
              >
                {category.name}
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
      <section id='app-sidebar-button'>
        <button onClick={newTempCategoryHandler}>Add Category</button>
      </section>
    </aside>
  )
}

export default AppSidebar