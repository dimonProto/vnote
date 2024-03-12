import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store'
import { toggleSettingsModal } from '../store/slices/settingsSlice'
import { toggleDarkTheme } from '../store/slices/themeSlice'


const SettingsModal = () => {
  const isOpen = useSelector(({ settingsState }) => settingsState.isOpen)
  const dark = useSelector(({ themeState }) => themeState.dark)
  const dispatch: AppDispatch = useDispatch()

  const node = useRef<HTMLDivElement>()

  const handleDomClick = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if (node.current && node.current.contains(event.target as HTMLDivElement)) return
    if (isOpen) {
      dispatch(toggleSettingsModal())
    }
  }

  const toggleDarkThemeHandler = () => {
    dispatch(toggleDarkTheme())
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleDomClick)
    return () => {
      document.removeEventListener('mousedown', handleDomClick)
    }
  }, [])

  return isOpen ? (
    <div className='dimmer'>
      <div ref={node} className='settings-modal'>
        <h2>Settings</h2>
        <button onClick={toggleDarkThemeHandler}>Toggle Dark Theme</button>
      </div>

    </div>
  ) : null
}

export default SettingsModal