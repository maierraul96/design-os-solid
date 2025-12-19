import { useNavigate } from '@solidjs/router'
import { FileText, Boxes, Layout, LayoutList, Package, ArrowRight } from 'lucide-solid'
import type { Phase } from './PhaseNav'
import type { Component } from 'solid-js'

interface NextPhaseButtonProps {
  nextPhase: Exclude<Phase, 'product'> // Can't navigate "next" to product since it's first
}

const phaseConfig: Record<Exclude<Phase, 'product'>, { label: string; icon: Component<{ class?: string; 'stroke-width'?: number }>; path: string }> = {
  'data-model': { label: 'Data Model', icon: Boxes, path: '/data-model' },
  'design': { label: 'Design', icon: Layout, path: '/design' },
  'sections': { label: 'Sections', icon: LayoutList, path: '/sections' },
  'export': { label: 'Export', icon: Package, path: '/export' },
}

export function NextPhaseButton(props: NextPhaseButtonProps) {
  const navigate = useNavigate()
  const config = () => phaseConfig[props.nextPhase]
  const Icon = () => config().icon

  return (
    <button
      onClick={() => navigate(config().path)}
      class="w-full flex items-center justify-between gap-4 px-6 py-4 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors group"
    >
      <div class="flex items-center gap-3">
        <Icon class="w-5 h-5" stroke-width={1.5} />
        <span class="font-medium">Continue to {config().label}</span>
      </div>
      <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1" stroke-width={1.5} />
    </button>
  )
}
