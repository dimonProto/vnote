import React, { createContext, FunctionComponent, useContext, useState } from 'react'


interface KeyboardContextInterface {
  addingTempCategory: boolean
  errorCategoryMessage: string
  setErrorCategoryMessage: (message: string) => void

  setAddingTempCategory(adding: boolean): void
}

const initialContextValue = {
  errorCategoryMessage: '',
  addingTempCategory: false,
  setAddingTempCategory: (adding: boolean): void => undefined,
  setErrorCategoryMessage: (message: string): void => undefined,
}

const KeyboardContext = createContext<KeyboardContextInterface>(initialContextValue)

const useKeyboard = (): KeyboardContextInterface => {
  const context = useContext(KeyboardContext)

  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardContext')
  }
  return context
}


const KeyboardProvider: FunctionComponent<React.PropsWithChildren<{}>> = ({ children }) => {
  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [errorCategoryMessage, setErrorCategoryMessage] = useState('')

  const value: KeyboardContextInterface = {
    addingTempCategory,
    setAddingTempCategory,
    errorCategoryMessage,
    setErrorCategoryMessage,
  }
  return <KeyboardContext.Provider value={value}>{children}</KeyboardContext.Provider>
}


export { KeyboardProvider, useKeyboard }