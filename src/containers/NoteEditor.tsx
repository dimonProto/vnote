import React, {useState} from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'
import {useDispatch, useSelector} from "react-redux";
import { updateNote} from "../actions";
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import options from '../constants/codeMirrorOptions'

interface NoteObject {
    id: string
    text: string
}

interface NoteProps {
    note: NoteObject
    updateNote: Function
}
interface NoteState {
    note: NoteObject
}

const NoteEditor = () => {
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
                dispatch(updateNote({id:activeNote.id, text: value}))
            }}
            onChange={(editor, data, value) => {}}
        />
    );
};

export default NoteEditor;