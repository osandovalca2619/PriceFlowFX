// hooks/useKeyboardShortcuts.ts (Bonus: Atajos de teclado)
import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  callback: () => void
  description: string
}

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase()
        const ctrlMatch = (shortcut.ctrlKey ?? false) === event.ctrlKey
        const shiftMatch = (shortcut.shiftKey ?? false) === event.shiftKey
        const metaMatch = (shortcut.metaKey ?? false) === event.metaKey

        return keyMatch && ctrlMatch && shiftMatch && metaMatch
      })

      if (matchingShortcut) {
        event.preventDefault()
        matchingShortcut.callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])

  return shortcuts
}
