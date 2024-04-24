import { NoteItem } from '../type'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { Folders } from '../constants'


export const getNoteTitle = (text: string) => {
  const noteTitleRegEx = /[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}'?!.,\s]{1,50}/gu

  const noteText = text.match(noteTitleRegEx)
  return noteText ? noteText[0] : 'New note'
}

export const noteWithFrontmatter = (note: NoteItem) => {
  return `---
  title: ${getNoteTitle(note.text)}
  created: ${note.created}
  lastUpdated: ${note.lastUpdated}
  category: ${note.category ? note.category : ''}
  ---
  
  ${note.text}`
}

export const downloadNote = (fileName: string, note: NoteItem) => {
  const pom = document.createElement('a')
  pom.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(noteWithFrontmatter(note))}`)
  pom.setAttribute('download', `${fileName}.md`)

  if (document.createEvent) {
    const event = document.createEvent('MouseEvent')
    event.initEvent('click', true, true)
    pom.dispatchEvent(event)
  } else {
    pom.click()
  }
}

export const sortByFavourites = (a: NoteItem, b: NoteItem) => {
  if (a.favorite && !b.favorite) return -1
  if (!a.favorite && b.favorite) return 1

  return 0

}

export const sortByLastUpdated = (a: NoteItem, b: NoteItem) => {
  let dataA = new Date(a.lastUpdated)
  let dataB = new Date(b.lastUpdated)
  return dataA > dataB ? -1 : dataA < dataB ? 1 : 0
}

export const newNote = (categoryId?: string, folder?: string): NoteItem => ({
  id: uuidv4(),
  text: '',
  created: moment().format(),
  lastUpdated: moment().format(),
  category: categoryId,
  favorite: folder === Folders.FAVORITES,
  searchValue: '',
})

