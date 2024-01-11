import React from 'react';
import {addNote} from "../store/slices/noteSlice";
import {swapNote} from "../actions";
import {useDispatch} from "react-redux";
import { v4 as uuidv4 } from 'uuid'

const Navigation = () => {
    const dispatch = useDispatch()
    return (
        <nav className='navigation'>
            <button onClick={() => {
                const note = {id: uuidv4(), text: 'new Note', created: '', lastUpdated:''}
                dispatch(addNote(note))
                dispatch(swapNote(note.id))
            }}>+ New Note</button>
        </nav>
    );
};

export default Navigation;