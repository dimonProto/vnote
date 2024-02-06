import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { AppDispatch } from '../store'
import { addCategory } from '../store/slices/categorySlice'

const AppSidebar = () => {
  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [tempCategory, setTempCategory] = useState('')

  const categories = useSelector(({ categoryState }) => categoryState.categories)

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
              <div key={category.id} className={!category ? 'category-each active' : 'category-each'}>
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
              placeholder='New catogory name...'
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