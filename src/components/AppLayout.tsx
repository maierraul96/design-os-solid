import type { JSX, ParentComponent } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Layers, ArrowLeft } from 'lucide-solid'
import { PhaseNav } from './PhaseNav'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'

interface AppLayoutProps {
  /** Optional title shown in the header (for sub-pages) */
  title?: string
  /** Optional back navigation path */
  backTo?: string
  /** Optional back label */
  backLabel?: string
  /** Whether to show the phase nav (default: true) */
  showPhaseNav?: boolean
}

export const AppLayout: ParentComponent<AppLayoutProps> = (props) => {
  const navigate = useNavigate()

  // Determine if this is a sub-page (has back navigation)
  const isSubPage = () => !!props.backTo
  const backLabel = () => props.backLabel ?? 'Back'
  const showPhaseNav = () => props.showPhaseNav !== false

  return (
    <div class="min-h-screen bg-background animate-fade-in flex flex-col">
      {/* Header */}
      <header class="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div class="px-4 sm:px-6 py-3">
          {isSubPage() ? (
            /* Sub-page header with back button */
            <div class="max-w-3xl mx-auto flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(props.backTo!)}
                class="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
              >
                <ArrowLeft class="w-4 h-4 mr-2" stroke-width={1.5} />
                {backLabel()}
              </Button>
              {props.title && (
                <>
                  <div class="h-4 w-px bg-stone-200 dark:bg-stone-700" />
                  <h1 class="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                    {props.title}
                  </h1>
                </>
              )}
              <div class="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          ) : (
            /* Main page header with phase nav - full width */
            <div class="flex items-center justify-between gap-4">
              {/* Theme Toggle on left for balance */}
              <div class="w-10 shrink-0">
                {/* Empty spacer for balance */}
              </div>

              {/* Phase Navigation - centered */}
              {showPhaseNav() && (
                <div class="flex-1 flex justify-center">
                  <PhaseNav />
                </div>
              )}

              {/* Theme Toggle */}
              <div class="w-10 shrink-0 flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main class="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        {props.children}
      </main>

      {/* Footer with logo */}
      <footer class="py-8 flex justify-center">
        <a
          href="https://buildermethods.com/design-os"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 transition-colors group"
        >
          <span class="text-xs">Powered by</span>
          <div class="w-5 h-5 rounded bg-stone-300 dark:bg-stone-600 flex items-center justify-center transition-colors group-hover:bg-stone-400 dark:group-hover:bg-stone-500">
            <Layers class="w-3 h-3 text-stone-100 dark:text-stone-900" stroke-width={1.5} />
          </div>
          <span class="text-xs font-medium">Design OS</span>
        </a>
      </footer>
    </div>
  )
}
