import React, { useEffect } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import { useDispatch, useSelector } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { AppDispatch } from 'store'
import { loadNotes, updateNote } from 'store/slices/noteSlice'
import options from 'constants/codeMirrorOptions'

interface NoteObject {
  id: string
  text: string
}

interface NoteProps {
  note: NoteObject
  updateNote: Function
}


const NoteEditor = () => {

  const activeNote = useSelector(({ notesState }) => {
    return notesState.data?.find(note => note.id === notesState.active)
  })

  const loading = useSelector(({ notesState }) => {
    return notesState.loading
  })

  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(loadNotes())
  }, [dispatch])

  if (loading) {
    return <div className='editor' />
  }

  if (!activeNote) {
    return <div>create your first note !</div>
  }
  return (

    <CodeMirror
      className='editor'
      value={activeNote.text}
      options={options}
      editorDidMount={editor => {
        editor.focus()
        editor.setCursor(editor.lineCount(), 0)
      }}
      onBeforeChange={(editor, data, value) => {
        dispatch(updateNote({ id: activeNote.id, text: value }))
      }}
      onChange={(editor, data, value) => {
        editor.focus()
        editor.setCursor(editor.lineCount(), 0)
      }}
    />
  )
}

export default NoteEditor