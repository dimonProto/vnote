import React, { MouseEventHandler } from 'react'
import { Icon } from 'react-feather'
import { iconColor } from '../constants'

export interface AppSidebarActionProps {
  disabled?: boolean,
  handler: MouseEventHandler,
  icon: Icon,
  label: string
}

const AppSidebarAction: React.FC<AppSidebarActionProps> = ({
                                                             disabled = false, handler, icon: IconCmp, label
                                                           }) => {
  return (
    <button
      className='action-button'
      aria-label={label}
      disabled={disabled}
      onClick={handler}>
        <span>
          <IconCmp
            size={18}
            className='action-button-icon'
            color={iconColor}
            aria-hidden='true'
            focusable='false'
          />
        </span>
    </button>
  )
}

export default AppSidebarAction