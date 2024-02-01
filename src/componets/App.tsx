import React from 'react'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import Navigation from 'containers/Navigation'
import CategoryList from 'containers/CategoryList'


const App: React.FC = () => {
  return (
    <div className='app'>
      <CategoryList />
      <NoteList />
      <NoteEditor />
      <Navigation />
    </div>
  )
}

export default App
