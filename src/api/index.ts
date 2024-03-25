import { SyncStatePayload } from '../type'

export const requestCategories = () => {
  new Promise((resolve, reject) => {
    const data = localStorage.getItem('categories') || '[]'
    if (data) {
      if (typeof data === 'string') {
        resolve(JSON.parse(data))
      }
    } else {
      reject({
        message: 'Something went wrong',
      })
    }
  })
}

export const requestNotes = () => {
  return new Promise((resolve, reject) => {
    const data = localStorage.getItem('notes') || '[]'

    if (data) {
      resolve(JSON.parse(data))
    } else {
      reject({
        message: 'Something went wrong',
      })
    }
  })
}

export const saveState = ({ categories, notes }: SyncStatePayload) => {

  new Promise((resolve, reject) => {
    localStorage.setItem('categories', JSON.stringify(categories))
    localStorage.setItem('notes', JSON.stringify(notes))

    resolve({
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
    })
  })
}