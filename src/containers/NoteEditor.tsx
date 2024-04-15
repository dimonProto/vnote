import React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import { useDispatch, useSelector } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { AppDispatch, RootState } from 'store'
import { updateNote } from 'store/slices/noteSlice'
import { NoteItem, VimModes } from '../type'
import moment from 'moment'
import { updateVimStateMode } from '../store/slices/settingsSlice'


const NoteEditor = () => {

  const activeNote: NoteItem = useSelector(({ notesState }: RootState) => {
    return notesState.notes?.find(note => note.id === notesState.activeNoteId)
  })
  const codeMirrorOptions = useSelector(({ settingsState }) => settingsState.codeMirrorOptions)
  const loading = useSelector(({ notesState }) => {
    return notesState.loading
  })

  const vimState = useSelector(({ settingsState }) => settingsState.vimState)

  const dispatch: AppDispatch = useDispatch()


  if (loading) {
    return <div className='empty-editor v-center'>Loading...</div>
  }

  if (!activeNote) {
    return (
      <div className='empty-editor v-center'>
        <div className='empty-editor v-center'>
          <div className='text-center'>
            <p>Create a note</p>
            <p>
              <kbd>ALT</kbd> + <kbd>N</kbd>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (

    <CodeMirror
      onDragOver={(editor, event) => {
        event.preventDefault()
        console.log(editor)
      }}
      className={`editor mousetrap ${vimState.mode === VimModes.insert ? 'vim-insert-mode' : ''}`}
      value={activeNote.text}
      options={codeMirrorOptions}
      editorDidMount={editor => {
        editor.focus()
        editor.setCursor(0)
      }}
      onKeyUp={editor => {
        if (editor.state.vim) {
          dispatch(updateVimStateMode(editor.state.vim.insertMode ? VimModes.insert : VimModes.default))
        }
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