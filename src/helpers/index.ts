export const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

export const getNoteTitle = text => {
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

export const downloadNote = (fileName: string, text: string) => {
  const pom = document.createElement('a')
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  pom.setAttribute('download', `${fileName}.md`)

  if (document.createEvent) {
    const event = document.createEvent('MouseEvent')
    event.initEvent('click', true, true)
    pom.dispatchEvent(event)
  } else {
    pom.click()
  }
}