import { FileText, Map, ClipboardList, Database, Layout, Package, Boxes, Palette, PanelLeft } from 'lucide-solid'
import { Card, CardContent } from '@/components/ui/card'
import type { Component } from 'solid-js'

type EmptyStateType = 'overview' | 'roadmap' | 'spec' | 'data' | 'screen-designs' | 'data-model' | 'design-system' | 'shell' | 'export'

interface EmptyStateProps {
  type: EmptyStateType
}

const config: Record<EmptyStateType, {
  icon: Component<{ class?: string; 'stroke-width'?: number }>
  title: string
  command: string
  description: string
}> = {
  overview: {
    icon: FileText,
    title: 'No product defined yet',
    command: '/product-vision',
    description: 'Define your product vision, key problems, and features',
  },
  roadmap: {
    icon: Map,
    title: 'No roadmap defined yet',
    command: '/product-roadmap',
    description: 'Break down your product into development sections',
  },
  spec: {
    icon: ClipboardList,
    title: 'No specification defined yet',
    command: '/shape-section',
    description: 'Define the user flows and UI requirements',
  },
  data: {
    icon: Database,
    title: 'No sample data generated yet',
    command: '/sample-data',
    description: 'Create realistic sample data for screen designs',
  },
  'screen-designs': {
    icon: Layout,
    title: 'No screen designs created yet',
    command: '/design-screen',
    description: 'Create screen designs for this section',
  },
  'data-model': {
    icon: Boxes,
    title: 'No data model defined yet',
    command: '/data-model',
    description: 'Define the core entities and relationships',
  },
  'design-system': {
    icon: Palette,
    title: 'No design tokens defined yet',
    command: '/design-tokens',
    description: 'Choose colors and typography for your product',
  },
  shell: {
    icon: PanelLeft,
    title: 'No application shell designed yet',
    command: '/design-shell',
    description: 'Design the navigation and layout',
  },
  export: {
    icon: Package,
    title: 'Ready to export',
    command: '/export-product',
    description: 'Generate the complete handoff package',
  },
}

export function EmptyState(props: EmptyStateProps) {
  const cfg = () => config[props.type]
  const Icon = () => cfg().icon

  return (
    <Card class="border-stone-200 dark:border-stone-700 shadow-sm border-dashed">
      <CardContent class="py-8">
        <div class="flex flex-col items-center text-center max-w-sm mx-auto">
          <div class="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
            <Icon class="w-5 h-5 text-stone-400 dark:text-stone-500" stroke-width={1.5} />
          </div>
          <h3 class="text-base font-medium text-stone-600 dark:text-stone-400 mb-1">
            {cfg().title}
          </h3>
          <p class="text-sm text-stone-500 dark:text-stone-400 mb-4">
            {cfg().description}
          </p>
          <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5 w-full">
            <p class="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
              Run in Claude Code:
            </p>
            <code class="text-sm font-mono text-stone-700 dark:text-stone-300">
              {cfg().command}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
