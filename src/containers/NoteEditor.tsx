import React, {useState} from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'
import {useDispatch, useSelector} from "react-redux";
import {swapNote, updateNote} from "../actions";
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import options from '../constants/codeMirrorOptions'

const NoteEditor = () => {
    const [value, setValue]= useState('')
    const activeNote = useSelector(({ notesState, activeState}) => {
        return notesState.notes.find(note => note.id === activeState.active)
    })

    const dispatch = useDispatch()

    return (

        <CodeMirror
            className="editor"
            value={activeNote.text}
            options={options}
            onBeforeChange={(editor, data, value) => {
                dispatch(updateNote(activeNote.text))
            }}
            onChange={(editor, data, value) => {}}
        />
    );
};

export default NoteEditor;