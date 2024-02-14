import { CategoryItem, NoteItem } from '../../type'
import { requestCategories, requestNotes, saveState } from 'api'

export const fetchNotes = async (): Promise<NoteItem[]> => {
  try {
    const notes = await requestNotes()
    return notes as NoteItem[] // Ensure that the data is treated as an array of NoteItem
  } catch (error) {
    throw new Error('Error fetching notes:', error)

  }
}

export const fetchCategories = async () => {
  try {
    const categories = await requestCategories()
    return categories
  } catch (error) {
    throw new Error('Error fetching Categories:', error)

  }
}

export const postState = (notes: NoteItem[], categories: CategoryItem[]) => {

  try {
    return saveState(notes, categories)
  } catch (error) {
    throw new Error('Response status is not 200')
  }

}

export const noteSaga = async (notes: NoteItem[], categories: CategoryItem[]) => {
  await fetchNotes()
  await fetchCategories()
  await postState(notes, categories)
}