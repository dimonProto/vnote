import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { AppDispatch } from '../store'
import { addCategory, swapCategory } from '../store/slices/categorySlice'
import { CategoryItem } from '../type'

const AppSidebar = () => {

  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)

  const dispatch: AppDispatch = useDispatch()

  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [tempCategory, setTempCategory] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const onSubmit = event => {
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
        <div onClick={() => dispatch(swapCategory(''))} className='app-sidebar-link'>
          Notes
        </div>
        <h2>Categories</h2>
        <div className='category-list'>
          {categories.map(category => {
            return (
              <div key={category.id}
                   className={category.id === activeCategoryId ? 'category-each active' : 'category-each'}
                   onClick={() => {
                     if (category.id !== activeCategoryId) {
                       dispatch(swapCategory(category.id))
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