import React from 'react'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import Navigation from 'containers/Navigation'


const App: React.FC = () => {
  return (
    <div className='app'>
      <NoteList />
      <NoteEditor />
      <Navigation />
    </div>
  )
}

export default App
