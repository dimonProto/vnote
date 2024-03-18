import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store'
import { toggleSettingsModal, updateCodeMirrorOption } from '../store/slices/settingsSlice'
import { toggleDarkTheme } from '../store/slices/themeSlice'


const SettingsModal = () => {
  const isOpen = useSelector(({ settingsState }) => settingsState.isOpen)
  const dark = useSelector(({ themeState }) => themeState.dark)
  const codeMirrorOptions = useSelector(({ settingsState }) => settingsState.codeMirrorOptions)

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

    if (!dark) {
      dispatch(updateCodeMirrorOption({ key: 'theme', value: 'zenburn' }))
    } else {
      dispatch(updateCodeMirrorOption({ key: 'theme', value: 'base16-light' }))
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleDomClick)
    return () => {
      document.removeEventListener('mousedown', handleDomClick)
    }
  })

  return isOpen ? (
    <div className='dimmer'>
      <div ref={node} className='settings-modal'>
        <h2>Settings</h2>
        <div className='settings-options vbetween'>
          <div className='settings-label'>Dark Mode</div>
          <label className='switch'>
            <input type='checkbox' onChange={toggleDarkThemeHandler} checked={dark} />
            <span className='slider round'></span>
          </label>
        </div>
        <div className='settings-options vbetween'>
          <div className='settings-label'>Vim Mode</div>
          <label className='switch'>
            <input
              type='checkbox'
              onChange={() => {
                if (codeMirrorOptions.keyMap === 'vim') {
                  dispatch(updateCodeMirrorOption({ key: 'keyMap', value: 'default' }))
                } else {
                  dispatch(updateCodeMirrorOption({ key: 'keyMap', value: 'vim' }))
                }

              }}
              checked={codeMirrorOptions.keyMap === 'vim'} />
            <span className='slider round'></span>
          </label>
        </div>
      </div>

    </div>
  ) : null
}

export default SettingsModal