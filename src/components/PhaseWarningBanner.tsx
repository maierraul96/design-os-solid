import { createSignal, createMemo, onMount, Show, For } from 'solid-js'
import { A } from '@solidjs/router'
import { AlertTriangle, X } from 'lucide-solid'
import { loadProductData } from '@/lib/product-loader'

/**
 * Get a storage key based on the product name to track dismissed warnings per product
 */
function getStorageKey(productName: string): string {
  const sanitized = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `design-os-phase-warning-dismissed-${sanitized}`
}

export function PhaseWarningBanner() {
  const productData = createMemo(() => loadProductData())
  const [isDismissed, setIsDismissed] = createSignal(true) // Start dismissed to avoid flash

  const hasDataModel = () => !!productData().dataModel
  const hasDesignSystem = () => !!(productData().designSystem?.colors || productData().designSystem?.typography)
  const hasShell = () => !!productData().shell?.spec
  const hasDesign = () => hasDesignSystem() || hasShell()

  const productName = () => productData().overview?.name || 'default-product'
  const storageKey = () => getStorageKey(productName())

  // Check localStorage on mount
  onMount(() => {
    const dismissed = localStorage.getItem(storageKey()) === 'true'
    setIsDismissed(dismissed)
  })

  const handleDismiss = () => {
    localStorage.setItem(storageKey(), 'true')
    setIsDismissed(true)
  }

  // Build the warning message
  const missingPhases = createMemo(() => {
    const phases: { name: string; path: string }[] = []
    if (!hasDataModel()) {
      phases.push({ name: 'Data Model', path: '/data-model' })
    }
    if (!hasDesign()) {
      phases.push({ name: 'Design', path: '/design' })
    }
    return phases
  })

  // Don't show if both phases are complete or if dismissed
  const shouldShow = () => !(hasDataModel() && hasDesign()) && !isDismissed()

  return (
    <Show when={shouldShow()}>
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-6">
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" stroke-width={2} />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-amber-800 dark:text-amber-200">
              Consider completing{' '}
              <For each={missingPhases()}>
                {(phase, index) => (
                  <span>
                    {index() > 0 && ' and '}
                    <A
                      href={phase.path}
                      class="font-medium underline hover:no-underline"
                    >
                      {phase.name}
                    </A>
                  </span>
                )}
              </For>{' '}
              before designing sections.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            class="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors shrink-0"
          >
            <X class="w-4 h-4" stroke-width={2} />
          </button>
        </div>
      </div>
    </Show>
  )
}
