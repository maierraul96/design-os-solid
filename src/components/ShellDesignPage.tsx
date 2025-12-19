import { Suspense, createMemo, createSignal, lazy, onMount, onCleanup, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { ArrowLeft, PanelLeft, Maximize2, GripVertical, Smartphone, Tablet, Monitor } from 'lucide-solid'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { loadShellPreview } from '@/lib/shell-loader'

const MIN_WIDTH = 320
const DEFAULT_WIDTH_PERCENT = 100

export function ShellDesignPage() {
  const navigate = useNavigate()
  const [widthPercent, setWidthPercent] = createSignal(DEFAULT_WIDTH_PERCENT)
  let containerRef: HTMLDivElement | undefined
  let isDragging = false

  const handleMouseDown = () => {
    isDragging = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef) return

      const containerRect = containerRef.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerCenter = containerRect.left + containerWidth / 2

      const distanceFromCenter = Math.abs(e.clientX - containerCenter)
      const maxDistance = containerWidth / 2

      let newWidthPercent = (distanceFromCenter / maxDistance) * 100

      const minPercent = (MIN_WIDTH / containerWidth) * 100
      newWidthPercent = Math.max(minPercent, Math.min(100, newWidthPercent))

      setWidthPercent(newWidthPercent)
    }

    const handleMouseUp = () => {
      isDragging = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  const previewWidth = () => `${widthPercent()}%`

  return (
    <div class="h-screen bg-stone-100 dark:bg-stone-900 animate-fade-in flex flex-col overflow-hidden">
      <header class="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0 z-50">
        <div class="px-4 py-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/design')}
            class="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
          >
            <ArrowLeft class="w-4 h-4 mr-2" stroke-width={1.5} />
            Back
          </Button>
          <div class="h-4 w-px bg-stone-200 dark:bg-stone-700" />
          <div class="flex items-center gap-2">
            <PanelLeft class="w-4 h-4 text-stone-400" stroke-width={1.5} />
            <span class="text-sm font-medium text-stone-700 dark:text-stone-300">
              Shell Design
            </span>
          </div>

          <div class="ml-auto flex items-center gap-4">
            <div class="flex items-center gap-1 border-r border-stone-200 dark:border-stone-700 pr-4">
              <button
                onClick={() => setWidthPercent(30)}
                class={`p-1.5 rounded transition-colors ${
                  widthPercent() <= 40
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Mobile (30%)"
              >
                <Smartphone class="w-4 h-4" stroke-width={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(60)}
                class={`p-1.5 rounded transition-colors ${
                  widthPercent() > 40 && widthPercent() <= 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Tablet (60%)"
              >
                <Tablet class="w-4 h-4" stroke-width={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(100)}
                class={`p-1.5 rounded transition-colors ${
                  widthPercent() > 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Desktop (100%)"
              >
                <Monitor class="w-4 h-4" stroke-width={1.5} />
              </button>
            </div>
            <span class="text-xs text-stone-500 dark:text-stone-400 font-mono w-10 text-right">
              {Math.round(widthPercent())}%
            </span>
            <ThemeToggle />
            <a
              href="/shell/design/fullscreen"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <Maximize2 class="w-3.5 h-3.5" stroke-width={1.5} />
              Fullscreen
            </a>
          </div>
        </div>
      </header>

      <div
        ref={containerRef}
        class="flex-1 overflow-hidden flex items-stretch justify-center p-6"
      >
        <div
          class="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div class="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
            <GripVertical class="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" stroke-width={2} />
          </div>
        </div>

        <div
          class="bg-white dark:bg-stone-950 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden"
          style={{ width: previewWidth(), "min-width": `${MIN_WIDTH}px`, "max-width": '100%' }}
        >
          <iframe
            src="/shell/design/fullscreen"
            class="w-full h-full border-0"
            title="Shell Preview"
          />
        </div>

        <div
          class="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div class="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
            <GripVertical class="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" stroke-width={2} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShellDesignFullscreen() {
  const shellPreviewLoader = loadShellPreview()

  const ShellPreviewComponent = createMemo(() => {
    if (!shellPreviewLoader) return null
    return lazy(shellPreviewLoader)
  })

  onMount(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'system'
      const root = document.documentElement

      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemDark)
      } else {
        root.classList.toggle('dark', theme === 'dark')
      }
    }

    applyTheme()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        applyTheme()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    const interval = setInterval(applyTheme, 100)

    onCleanup(() => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    })
  })

  const PreviewComponent = () => ShellPreviewComponent()

  return (
    <Show when={PreviewComponent()} fallback={
      <div class="h-screen flex items-center justify-center bg-background">
        <p class="text-stone-600 dark:text-stone-400">Shell preview not found.</p>
      </div>
    }>
      {(Component) => (
        <Suspense fallback={
          <div class="h-screen flex items-center justify-center bg-background">
            <div class="text-stone-500 dark:text-stone-400">Loading...</div>
          </div>
        }>
          <Component />
        </Suspense>
      )}
    </Show>
  )
}
