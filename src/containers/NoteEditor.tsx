import React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import { useDispatch, useSelector } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { AppDispatch, RootState } from 'store'
import { updateNote } from 'store/slices/noteSlice'
import { NoteItem } from '../type'
import moment from 'moment'


const NoteEditor = () => {

  const activeNote: NoteItem = useSelector(({ notesState }: RootState) => {
    return notesState.notes?.find(note => note.id === notesState.activeNoteId)
  })
  const codeMirrorOptions = useSelector(({ settingsState }) => settingsState.codeMirrorOptions)
  const loading = useSelector(({ notesState }) => {
    return notesState.loading
  })

  const dispatch: AppDispatch = useDispatch()


  if (loading) {
    return <div className='empty-editor v-center'>Loading...</div>
  }

  if (!activeNote) {
    return <div className='empty-editor v-center' />
  }

  return (

    <CodeMirror
      onDragOver={(editor, event) => {
        event.preventDefault()
        console.log(editor)
      }}
      className='editor mousetrap'
      value={activeNote.text}
      options={codeMirrorOptions}
      editorDidMount={editor => {
        editor.focus()
        editor.setCursor(0)
      }}
      onBeforeChange={(editor, data, value) => {
        dispatch(updateNote({
          id: activeNote.id,
          text: value,
          created: activeNote.created,
          lastUpdated: moment().format(),
        }))
      }}
      onChange={(editor, data, value) => {
        if (activeNote && activeNote.text === '') {
          editor.focus()
        }
      }}></CodeMirror>
  )
}

export default NoteEditor