import React from 'react'

const AppSidebar = () => {
  return (
    <aside className='app-sidebar'>
      <div>All notes</div>
      <div className='category-list'>
        {[1, 2, 3].map((category) => {
          return (
            <div key={category} className={!category ? 'category-each active' : 'category-each'}></div>
          )
        })}
      </div>
      <div>Add Category</div>
    </aside>
  )
}

export default AppSidebar