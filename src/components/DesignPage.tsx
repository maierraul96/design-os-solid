import { createMemo, Show, For } from 'solid-js'
import { A } from '@solidjs/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'
import { ChevronRight, Layout } from 'lucide-solid'

// Map Tailwind color names to actual color values for preview
const colorMap: Record<string, { light: string; base: string; dark: string }> = {
  red: { light: '#fca5a5', base: '#ef4444', dark: '#dc2626' },
  orange: { light: '#fdba74', base: '#f97316', dark: '#ea580c' },
  amber: { light: '#fcd34d', base: '#f59e0b', dark: '#d97706' },
  yellow: { light: '#fde047', base: '#eab308', dark: '#ca8a04' },
  lime: { light: '#bef264', base: '#84cc16', dark: '#65a30d' },
  green: { light: '#86efac', base: '#22c55e', dark: '#16a34a' },
  emerald: { light: '#6ee7b7', base: '#10b981', dark: '#059669' },
  teal: { light: '#5eead4', base: '#14b8a6', dark: '#0d9488' },
  cyan: { light: '#67e8f9', base: '#06b6d4', dark: '#0891b2' },
  sky: { light: '#7dd3fc', base: '#0ea5e9', dark: '#0284c7' },
  blue: { light: '#93c5fd', base: '#3b82f6', dark: '#2563eb' },
  indigo: { light: '#a5b4fc', base: '#6366f1', dark: '#4f46e5' },
  violet: { light: '#c4b5fd', base: '#8b5cf6', dark: '#7c3aed' },
  purple: { light: '#d8b4fe', base: '#a855f7', dark: '#9333ea' },
  fuchsia: { light: '#f0abfc', base: '#d946ef', dark: '#c026d3' },
  pink: { light: '#f9a8d4', base: '#ec4899', dark: '#db2777' },
  rose: { light: '#fda4af', base: '#f43f5e', dark: '#e11d48' },
  slate: { light: '#cbd5e1', base: '#64748b', dark: '#475569' },
  gray: { light: '#d1d5db', base: '#6b7280', dark: '#4b5563' },
  zinc: { light: '#d4d4d8', base: '#71717a', dark: '#52525b' },
  neutral: { light: '#d4d4d4', base: '#737373', dark: '#525252' },
  stone: { light: '#d6d3d1', base: '#78716c', dark: '#57534e' },
}

function getDesignPageStepStatuses(
  hasDesignSystem: boolean,
  hasShell: boolean
): StepStatus[] {
  const statuses: StepStatus[] = []

  if (hasDesignSystem) {
    statuses.push('completed')
  } else {
    statuses.push('current')
  }

  if (hasShell) {
    statuses.push('completed')
  } else if (hasDesignSystem) {
    statuses.push('current')
  } else {
    statuses.push('upcoming')
  }

  return statuses
}

export default function DesignPage() {
  const productData = createMemo(() => loadProductData())
  const designSystem = () => productData().designSystem
  const shell = () => productData().shell

  const hasDesignSystem = () => !!(designSystem()?.colors || designSystem()?.typography)
  const hasShell = () => !!shell()?.spec
  const allStepsComplete = () => hasDesignSystem() && hasShell()

  const stepStatuses = () => getDesignPageStepStatuses(hasDesignSystem(), hasShell())

  return (
    <AppLayout>
      <div class="space-y-6">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Design System
          </h1>
          <p class="text-stone-600 dark:text-stone-400">
            Define the visual foundation and application shell for your product.
          </p>
        </div>

        <StepIndicator step={1} status={stepStatuses()[0]}>
          <Show when={designSystem()?.colors || designSystem()?.typography} fallback={<EmptyState type="design-system" />}>
            <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
              <CardHeader class="pb-4">
                <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Design Tokens
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <Show when={designSystem()?.colors}>
                  {(colors) => (
                    <div>
                      <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
                        Colors
                      </h4>
                      <div class="grid grid-cols-3 gap-6">
                        <ColorSwatch label="Primary" colorName={colors().primary} />
                        <ColorSwatch label="Secondary" colorName={colors().secondary} />
                        <ColorSwatch label="Neutral" colorName={colors().neutral} />
                      </div>
                    </div>
                  )}
                </Show>

                <Show when={designSystem()?.typography}>
                  {(typography) => (
                    <div>
                      <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4">
                        Typography
                      </h4>
                      <div class="grid grid-cols-3 gap-6">
                        <div>
                          <p class="text-xs text-stone-500 dark:text-stone-400 mb-1">Heading</p>
                          <p class="font-semibold text-stone-900 dark:text-stone-100">
                            {typography().heading}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-stone-500 dark:text-stone-400 mb-1">Body</p>
                          <p class="text-stone-900 dark:text-stone-100">
                            {typography().body}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-stone-500 dark:text-stone-400 mb-1">Mono</p>
                          <p class="font-mono text-stone-900 dark:text-stone-100">
                            {typography().mono}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Show>

                <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5">
                  <p class="text-xs text-stone-500 dark:text-stone-400">
                    Run <code class="font-mono text-stone-700 dark:text-stone-300">/design-tokens</code> to update
                  </p>
                </div>
              </CardContent>
            </Card>
          </Show>
        </StepIndicator>

        <StepIndicator step={2} status={stepStatuses()[1]} isLast={!allStepsComplete()}>
          <Show when={shell()?.spec} fallback={<EmptyState type="shell" />}>
            {(spec) => (
              <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader class="pb-4">
                  <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Application Shell
                  </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Show when={spec().overview}>
                    <p class="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {spec().overview}
                    </p>
                  </Show>

                  <Show when={spec().navigationItems.length > 0}>
                    <div>
                      <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2">
                        Navigation
                      </h4>
                      <ul class="space-y-1">
                        <For each={spec().navigationItems}>
                          {(item) => {
                            const parts = item.split(/\*\*([^*]+)\*\*/)
                            return (
                              <li class="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <span class="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                                <For each={parts}>
                                  {(part, i) => i() % 2 === 1 ? <strong class="font-semibold">{part}</strong> : <span>{part}</span>}
                                </For>
                              </li>
                            )
                          }}
                        </For>
                      </ul>
                    </div>
                  </Show>

                  <Show when={shell()?.hasComponents}>
                    <div class="pt-2 border-t border-stone-100 dark:border-stone-800">
                      <A
                        href="/shell/design"
                        class="flex items-center justify-between gap-4 py-2 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                            <Layout class="w-4 h-4 text-stone-600 dark:text-stone-300" stroke-width={1.5} />
                          </div>
                          <span class="font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                            View Shell Design
                          </span>
                        </div>
                        <ChevronRight class="w-4 h-4 text-stone-400 dark:text-stone-500" stroke-width={1.5} />
                      </A>
                    </div>
                  </Show>

                  <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5">
                    <p class="text-xs text-stone-500 dark:text-stone-400">
                      Run <code class="font-mono text-stone-700 dark:text-stone-300">/design-shell</code> to update
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </Show>
        </StepIndicator>

        <Show when={allStepsComplete()}>
          <StepIndicator step={3} status="current" isLast>
            <NextPhaseButton nextPhase="sections" />
          </StepIndicator>
        </Show>
      </div>
    </AppLayout>
  )
}

interface ColorSwatchProps {
  label: string
  colorName: string
}

function ColorSwatch(props: ColorSwatchProps) {
  const colors = () => colorMap[props.colorName] || colorMap.stone

  return (
    <div>
      <div class="flex gap-0.5 mb-2">
        <div
          class="flex-1 h-14 rounded-l-md"
          style={{ "background-color": colors().light }}
          title={`${props.colorName}-300`}
        />
        <div
          class="flex-[2] h-14"
          style={{ "background-color": colors().base }}
          title={`${props.colorName}-500`}
        />
        <div
          class="flex-1 h-14 rounded-r-md"
          style={{ "background-color": colors().dark }}
          title={`${props.colorName}-600`}
        />
      </div>
      <p class="text-sm font-medium text-stone-900 dark:text-stone-100">{props.label}</p>
      <p class="text-xs text-stone-500 dark:text-stone-400">{props.colorName}</p>
    </div>
  )
}
