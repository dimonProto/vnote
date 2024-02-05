import { NoteItem } from '../../type'
import { requestCategories, requestNotes, saveState } from 'api'

export const fetchNotes = async (): Promise<NoteItem[]> => {
  try {
    const data = await requestNotes()
    return data as NoteItem[] // Ensure that the data is treated as an array of NoteItem
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

export const fetchCategories = async () => {
  try {
    const data = await requestCategories()
    return data
  } catch (error) {
    console.error('Error fetching Categories:', error)
    throw error
  }
}

export const syncState = (state) => {
  try {
    return saveState(state)
  } catch (error) {
    throw new Error('Response status is not 200')
  }

}

export const noteSaga = async (state) => {
  await fetchNotes()
  await fetchCategories()
  await syncState(state)
}