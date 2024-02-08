import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { AppDispatch } from '../store'
import { addCategory, swapCategory } from '../store/slices/categorySlice'
import { CategoryItem } from '../type'

const AppSidebar = () => {
  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [tempCategory, setTempCategory] = useState('')

  const categories: CategoryItem[] = useSelector(({ categoryState }) => categoryState.categories)
  const activeCategoryId = useSelector(({ categoryState }) => categoryState.activeCategoryId)

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }
  const dispatch: AppDispatch = useDispatch()

  return (
    <aside className='app-sidebar'>
      <section id='app-sidebar-main'>
        <h1>vNote</h1>
        <p>All Notes</p>
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
            onSubmit={event => {
              event.preventDefault()
              const category = { id: kebabCase(tempCategory), name: tempCategory }
              dispatch(addCategory(category))
              setTempCategory('')
              setAddingTempCategory(false)
            }}
          >
            <input
              autoFocus
              placeholder='New category...'
              onChange={event => {
                setTempCategory(event.target.value)
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