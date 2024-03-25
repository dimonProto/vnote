import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store'
import { toggleSettingsModal, updateCodeMirrorOption } from '../store/slices/settingsSlice'
import { toggleDarkTheme } from '../store/slices/themeSlice'
import Switch from '../componets/Switch'
import { ReactMouseEvent } from '../type'


const SettingsModal = () => {
  const isOpen = useSelector(({ settingsState }) => settingsState.isOpen)
  const dark = useSelector(({ themeState }) => themeState.dark)
  const codeMirrorOptions = useSelector(({ settingsState }) => settingsState.codeMirrorOptions)

  const dispatch: AppDispatch = useDispatch()

  const node = useRef<HTMLDivElement>()

  const handleDomClick = (event: ReactMouseEvent) => {
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

  const toggleVimMode = () => {
    dispatch(updateCodeMirrorOption({
      key: 'keyMap',
      value: codeMirrorOptions.keyMap === 'vim' ? 'default' : 'vim',
    }))
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

        <div className='settings-options'>
          <div className='settings-label'>Dark Mode</div>
          <Switch toggle={toggleDarkThemeHandler} checked={dark} />
        </div>

        <div className='settings-options'>
          <div className='settings-label'>Vim Mode</div>
          <Switch toggle={toggleVimMode} checked={codeMirrorOptions.keyMap === 'vim'} />
        </div>

        <section className='settings-section'>
          <div className='settings-label mb-1'>Keyboard Shortcuts</div>
          <div className='settings-shortcut'>
            <div>Create note</div>
            <div>
              <kbd>
                <kbd>Alt</kbd> + <kbd>N</kbd>
              </kbd>
            </div>
          </div>
          <div className='settings-shortcut'>
            <div>Delete note</div>
            <div>
              <kbd>
                <kbd>Alt</kbd> + <kbd>W</kbd>
              </kbd>
            </div>
          </div>
          <div className='settings-shortcut'>
            <div>Create category</div>
            <div>
              <kbd>
                <kbd>Alt</kbd> + <kbd>C</kbd>
              </kbd>
            </div>
          </div>
          <div className='settings-shortcut'>
            <div>Download note</div>
            <div>
              <kbd>
                <kbd>Alt</kbd> + <kbd>D</kbd>
              </kbd>
            </div>
          </div>
          <div className='settings-shortcut'>
            <div>Sync note</div>
            <div>
              <kbd>
                <kbd>Alt</kbd> + <kbd>S</kbd>
              </kbd>
            </div>
          </div>
        </section>
      </div>
    </div>
  ) : null
}

export default SettingsModal