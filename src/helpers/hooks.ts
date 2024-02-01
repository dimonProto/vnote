import { useEffect, useRef } from 'react'
import mousetrap from 'mousetrap'
import 'mousetrap-global-bind'

const noop = () => {
}

export const useInterval = (callback: () => void, delay: number | null, immediate?: boolean) => {
  const savedCallback = useRef(noop)
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Execute callback if immediate is set.
  useEffect(() => {
    if (immediate && delay !== null) {
      savedCallback.current()
    }
  }, [immediate, delay])
  // Set up the interval.
  useEffect(() => {
    if (delay === null) {
      return // Don't set up the interval if delay is null
    }

    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)

    return () => clearInterval(id) // Cleanup on unmount

  }, [delay])

}

export const useKey = (handlerKey: string, handlerCallback: () => void) => {
  let actionRef = useRef(noop)
  actionRef.current = handlerCallback

  useEffect(() => {
    mousetrap.bindGlobal(handlerKey, () => {
      typeof actionRef.current === 'function' && actionRef.current()
    })
    return () => {
      mousetrap.unbind(handlerKey)
    }
  }, [handlerKey])
}