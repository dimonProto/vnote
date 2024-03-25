import React, { createContext, FunctionComponent, useContext, useState } from 'react'


interface TempStateContextInterface {
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

const TempStateContext = createContext<TempStateContextInterface>(initialContextValue)

const useTempState = (): TempStateContextInterface => {
  const context = useContext(TempStateContext)

  if (!context) {
    throw new Error('useTempState must be used within a TempStateProvider')
  }
  return context
}


const TempStateProvider: FunctionComponent<React.PropsWithChildren<{}>> = ({ children }) => {
  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [errorCategoryMessage, setErrorCategoryMessage] = useState('')

  const value: TempStateContextInterface = {
    addingTempCategory,
    setAddingTempCategory,
    errorCategoryMessage,
    setErrorCategoryMessage,
  }

  return <TempStateContext.Provider value={value}>{children}</TempStateContext.Provider>
}


export { TempStateProvider, useTempState }