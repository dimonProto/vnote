import React from 'react'

const CategoryList = () => {
  return (
    <aside className='category-sidebar'>
      <div className='category-list'>
        {[1, 2, 3].map((category) => {
          return (
            <div key={category} className={!category ? 'category-each active' : 'category-each'}></div>
          )
        })}
      </div>

    </aside>
  )
}

export default CategoryList