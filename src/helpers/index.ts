import { NoteItem } from '../type'

export const getNoteTitle = (text: string) => {
  let noteTitle: string
  if (!text) {
    noteTitle = 'New Note'
  } else if (text.indexOf('\n') !== -1) {
    noteTitle = text.slice(0, text.indexOf('\n'))
  } else {
    noteTitle = text.slice(0, 50)
  }
  return noteTitle
}

export const noteWithFrontmatter = (note: NoteItem) => {
  return `---
  title: ${getNoteTitle(note.text)}
  created: ${note.created}
  lastUpdated: ${note.lastUpdated}
  ---
  
  ${note.text}`
}

export const downloadNote = (fileName: string, note: NoteItem) => {
  const pom = document.createElement('a')
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(noteWithFrontmatter(note)))
  pom.setAttribute('download', `${fileName}.md`)

  if (document.createEvent) {
    const event = document.createEvent('MouseEvent')
    event.initEvent('click', true, true)
    pom.dispatchEvent(event)
  } else {
    pom.click()
  }
}