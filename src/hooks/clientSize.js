import { useCallback, useEffect, useState } from "react"

const useClientSize = (ref) => {
  const [clientSize, setClientSize] = useState({
    width: undefined,
    height: undefined,
  })

  const handleResize = () => {
    setClientSize({
      width: ref.current?.clientWidth,
      height: ref.current?.clientHeight,
    })
  }

  useEffect(() => {
    console.log("[ClientSize]", "ref", ref.current)
    if (!ref.current) {
      return
    }
    window.addEventListener("resize", handleResize)

    setClientSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
    })

    return () => window.removeEventListener("resize", handleResize)
  }, [ref.current])

  return clientSize
}

export default useClientSize
