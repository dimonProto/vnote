import { useEffect, useRef } from 'react'
import mousetrap from 'mousetrap'
import 'mousetrap-global-bind'

const noop = () => {
}

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(noop)
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])


  // Set up the interval.
  useEffect(() => {


    const tick = () => savedCallback.current()

    if (delay === null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id) // Cleanup on unmount
    }

  }, [delay])

}

export const useKey = (key: string, action: () => void) => {
  let actionRef = useRef(noop)
  actionRef.current = action

  useEffect(() => {
    mousetrap.bindGlobal(key, () => {
      if (!actionRef.current) return
      actionRef.current()
    })
    return () => mousetrap.unbind(key)

  }, [key])
}