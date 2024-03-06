import { useEffect, useState } from "react"

let beforeReadValue = null

export const useReadLocalStorage = (key) => {
  const [storedValue, setStoredValue] = useState(() => {
    const v = window?.localStorage.getItem(key)
    if (!v) {
      return null
    }
    return JSON.parse(v)
  })

  window.addEventListener("storage", (e) => {
    let v = window.localStorage.getItem(key)
    setStoredValue(JSON.parse(v))
  })

  return [storedValue]
}

const useLocalStorage = (key, initialValue) => {
  const [storedValue] = useReadLocalStorage(key)
  const [_storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (e) {
      console.error(e)
      return initialValue
    }
  })

  const setValue = async (value) => {
    try {
      const valueToStored =
        value instanceof Function ? value(_storedValue) : value
      if (JSON.stringify(valueToStored) === localStorage.getItem(key)) {
        return
      }
      localStorage.setItem(key, JSON.stringify(valueToStored))
      setStoredValue(valueToStored)
    } catch (e) {
      console.error(e)
    }
  }

  const updateValue = async (value) => {
    try {
      let lString = window.localStorage.getItem(key)
      if (!lString) {
        return
      }
      await setValue(value)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    window.dispatchEvent(new Event("storage"))
  }, [_storedValue])

  return [storedValue, setValue, updateValue]
}

export default useLocalStorage
