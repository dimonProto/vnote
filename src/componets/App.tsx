import React from 'react'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import Navigation from 'containers/Navigation'
import AppSidebar from 'containers/AppSidebar'


const App: React.FC = () => {
  return (
    <div className='app'>
      <AppSidebar />
      <NoteList />
      <NoteEditor />
      <Navigation />
    </div>
  )
}

export default App
