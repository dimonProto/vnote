import { SWAP_NOTE } from 'constants/actionTypes'


export const swapNote = noteId => ({
    type: SWAP_NOTE,
    payload: noteId,
})