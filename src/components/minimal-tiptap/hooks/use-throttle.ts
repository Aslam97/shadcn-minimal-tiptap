/**
 * @see https://github.com/streamich/react-use/blob/master/src/useThrottle.ts
 */
import { useEffect, useRef, useState } from 'react'

export const useThrottle = <T>(value: T, ms: number = 200) => {
  const [state, setState] = useState<T>(value)
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const nextValue = useRef(null) as any
  const hasNextValue = useRef(0) as any

  useEffect(() => {
    if (!timeout.current) {
      setState(value)
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false
          setState(nextValue.current)
          timeout.current = setTimeout(timeoutCallback, ms)
        } else {
          timeout.current = undefined
        }
      }
      timeout.current = setTimeout(timeoutCallback, ms)
    } else {
      nextValue.current = value
      hasNextValue.current = true
    }
  }, [value, ms])

  // Inline implementation of useUnmount
  const unmountRef = useRef<(() => any) | null>(null)
  unmountRef.current = () => {
    timeout.current && clearTimeout(timeout.current)
  }

  useEffect(() => {
    return () => unmountRef.current && unmountRef.current()
  }, [])

  return state
}

export default useThrottle
