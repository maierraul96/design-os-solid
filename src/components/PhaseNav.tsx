import { useLocation, useNavigate } from '@solidjs/router'
import { createMemo, For, type Component } from 'solid-js'
import { FileText, Boxes, Layout, LayoutList, Package } from 'lucide-solid'
import { loadProductData, hasExportZip } from '@/lib/product-loader'
import { getAllSectionIds, getSectionScreenDesigns } from '@/lib/section-loader'

export type Phase = 'product' | 'data-model' | 'design' | 'sections' | 'export'

interface PhaseConfig {
  id: Phase
  label: string
  icon: Component<{ class?: string; 'stroke-width'?: number }>
  path: string
}

const phases: PhaseConfig[] = [
  { id: 'product', label: 'Product', icon: FileText, path: '/' },
  { id: 'data-model', label: 'Data Model', icon: Boxes, path: '/data-model' },
  { id: 'design', label: 'Design', icon: Layout, path: '/design' },
  { id: 'sections', label: 'Sections', icon: LayoutList, path: '/sections' },
  { id: 'export', label: 'Export', icon: Package, path: '/export' },
]

export type PhaseStatus = 'completed' | 'current' | 'upcoming'

interface PhaseInfo {
  phase: PhaseConfig
  status: PhaseStatus
  isComplete: boolean
}

function usePhaseStatuses(): () => PhaseInfo[] {
  const location = useLocation()
  const productData = createMemo(() => loadProductData())

  return createMemo(() => {
    // Calculate completion status for each phase
    const data = productData()
    const hasOverview = !!data.overview
    const hasRoadmap = !!data.roadmap
    const hasDataModel = !!data.dataModel
    const hasDesignSystem = !!data.designSystem
    const hasShell = !!data.shell

    const sectionIds = getAllSectionIds()
    const sectionsWithScreenDesigns = sectionIds.filter(id => getSectionScreenDesigns(id).length > 0).length
    const hasSections = sectionsWithScreenDesigns > 0

    // Determine current phase from URL
    const currentPath = location.pathname
    let currentPhaseId: Phase = 'product'

    if (currentPath === '/' || currentPath === '/product') {
      currentPhaseId = 'product'
    } else if (currentPath === '/data-model') {
      currentPhaseId = 'data-model'
    } else if (currentPath === '/design' || currentPath === '/design-system' || currentPath.startsWith('/shell')) {
      currentPhaseId = 'design'
    } else if (currentPath === '/sections' || currentPath.startsWith('/sections/')) {
      currentPhaseId = 'sections'
    } else if (currentPath === '/export') {
      currentPhaseId = 'export'
    }

    // Check if export zip exists
    const exportZipExists = hasExportZip()

    // Determine completion status
    const phaseComplete: Record<Phase, boolean> = {
      'product': hasOverview && hasRoadmap,
      'data-model': hasDataModel,
      'design': hasDesignSystem || hasShell,
      'sections': hasSections,
      'export': exportZipExists,
    }

    return phases.map(phase => {
      const isComplete = phaseComplete[phase.id]
      let status: PhaseStatus
      if (phase.id === currentPhaseId) {
        status = 'current'
      } else if (isComplete) {
        status = 'completed'
      } else {
        status = 'upcoming'
      }
      return { phase, status, isComplete }
    })
  })
}

export function PhaseNav() {
  const navigate = useNavigate()
  const phaseInfos = usePhaseStatuses()

  return (
    <nav class="flex items-center justify-center">
      <For each={phaseInfos()}>
        {(info, index) => {
          const Icon = info.phase.icon
          const isFirst = index() === 0

          return (
            <div class="flex items-center">
              {/* Connector line */}
              {!isFirst && (
                <div
                  class={`w-4 sm:w-8 lg:w-12 h-px transition-colors duration-200 ${
                    info.status === 'upcoming'
                      ? 'bg-stone-200 dark:bg-stone-700'
                      : 'bg-stone-400 dark:bg-stone-500'
                  }`}
                />
              )}

              {/* Phase button */}
              <button
                onClick={() => navigate(info.phase.path)}
                class={`
                  group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${info.status === 'current'
                    ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm'
                    : info.status === 'completed'
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }
                `}
              >
                <Icon
                  class={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    info.status === 'current' ? '' : info.status === 'completed' ? '' : 'opacity-60'
                  }`}
                  stroke-width={1.5}
                />
                <span class={`text-sm font-medium hidden sm:inline ${
                  info.status === 'upcoming' ? 'opacity-60' : ''
                }`}>
                  {info.phase.label}
                </span>

                {/* Completion indicator - check circle at top-left (shows even when current) */}
                {info.isComplete && (
                  <span class="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center shadow-sm">
                    <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          )
        }}
      </For>
    </nav>
  )
}

export { phases }
