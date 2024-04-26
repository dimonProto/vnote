import React, { KeyboardEventHandler, MouseEventHandler } from 'react'
import { Icon } from 'react-feather'

interface NoteOptionsButtonProps {
  handler: MouseEventHandler & KeyboardEventHandler
  icon: Icon
  text: string
}

const NoteOptionsButton: React.FC<NoteOptionsButtonProps> = ({ handler, icon: IconComp, text, ...rest }) => {
  return (
    <div className='nav-item'
         onClick={handler}
         onKeyPress={handler}
         tabIndex={0}
         {...rest}
    >
      <IconComp size={18} />
      {text}
    </div>
  )
}

export default NoteOptionsButton