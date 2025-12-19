import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'
import { Moon, Sun } from 'lucide-solid'
import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>('system')

  // Initialize from localStorage on mount
  onMount(() => {
    const stored = localStorage.getItem('theme') as Theme
    if (stored) setTheme(stored)
  })

  // Apply theme changes
  createEffect(() => {
    const currentTheme = theme()
    const root = document.documentElement

    const applyTheme = (t: Theme) => {
      if (t === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemDark)
      } else {
        root.classList.toggle('dark', t === 'dark')
      }
    }

    applyTheme(currentTheme)
    localStorage.setItem('theme', currentTheme)

    // Listen for system theme changes when in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme() === 'system') {
        applyTheme('system')
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    onCleanup(() => mediaQuery.removeEventListener('change', handleChange))
  })

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }

  const isDark = () =>
    theme() === 'dark' ||
    (theme() === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      class="w-8 h-8 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
      title={`Theme: ${theme()}`}
    >
      {isDark() ? (
        <Moon class="w-4 h-4" stroke-width={1.5} />
      ) : (
        <Sun class="w-4 h-4" stroke-width={1.5} />
      )}
    </Button>
  )
}
