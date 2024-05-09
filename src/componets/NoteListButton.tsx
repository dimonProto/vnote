import React, { MouseEventHandler } from 'react'

export interface NoteListButtonProps {
  disabled?: boolean
  handler: MouseEventHandler
  label: string
  children?: React.ReactNode // Add this line if children are expected
}

const NoteListButton: React.FC<NoteListButtonProps> = ({ disabled = false, handler, label }) => {
  return (
    <button
      className='list-button'
      aria-label={label}
      onClick={handler}
      disabled={disabled}
      title={label}
      data-cy={label}
    >
      {label}
    </button>
  )
}

export default NoteListButton