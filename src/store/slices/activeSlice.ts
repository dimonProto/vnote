import { createSlice } from '@reduxjs/toolkit'
import notes from "../../constants/fakeState";

export interface activeState {
    active: string;
}


const initialState: activeState = {
    active: notes.notes?.[0].id || '' ,
};

export const activeSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        swapNote: (state , action) => {
            state.active = action.payload
        },
    },
});

// Action creators are generated for each case reducer function
export const { swapNote } = activeSlice.actions

export default activeSlice.reducer