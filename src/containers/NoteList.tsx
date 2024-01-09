import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../store";

const NoteList = () => {

    const notes = useSelector((state: RootState) => state.notesState.notes)


    return (
        <aside className="sidebar">
            <div className="note-list">
                {notes.map(note => {
                    const noteTitle = note.text.indexOf('\n') !== -1 ? note.text.slice(0, note.text.indexOf('\n')) : note.text.slice(0,50)
                    return (
                        <div key={note.id} className="note-title">
                            {noteTitle}
                        </div>
                    )
                })}
            </div>
            
        </aside>
    );
};

export default NoteList;