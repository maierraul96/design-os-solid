import { createSignal, Show, For } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ArrowRight, ChevronDown } from 'lucide-solid'
import type { ProductOverview } from '@/types/product'

interface ProductOverviewCardProps {
  overview: ProductOverview
}

export function ProductOverviewCard(props: ProductOverviewCardProps) {
  const [problemsOpen, setProblemsOpen] = createSignal(false)
  const [featuresOpen, setFeaturesOpen] = createSignal(false)

  return (
    <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Product overview: {props.overview.name}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        {/* Description */}
        <Show when={props.overview.description}>
          <p class="text-stone-600 dark:text-stone-400 leading-relaxed">
            {props.overview.description}
          </p>
        </Show>

        {/* Problems & Solutions - Expandable */}
        <Show when={props.overview.problems.length > 0}>
          <Collapsible open={problemsOpen()} onOpenChange={setProblemsOpen}>
            <CollapsibleTrigger class="flex items-center justify-between w-full py-2 text-left group">
              <span class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Problems & Solutions
                <span class="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({props.overview.problems.length})
                </span>
              </span>
              <ChevronDown
                class={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  problemsOpen() ? 'rotate-180' : ''
                }`}
                stroke-width={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul class="space-y-3 pt-2">
                <For each={props.overview.problems}>
                  {(problem) => (
                    <li class="flex items-start gap-3">
                      <ArrowRight class="w-4 h-4 text-stone-900 dark:text-stone-100 mt-1 shrink-0" stroke-width={2} />
                      <div>
                        <span class="font-medium text-stone-800 dark:text-stone-200">
                          {problem.title}
                        </span>
                        <span class="text-stone-500 dark:text-stone-400 mx-2">—</span>
                        <span class="text-stone-600 dark:text-stone-400">
                          {problem.solution}
                        </span>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Show>

        {/* Key Features - Expandable */}
        <Show when={props.overview.features.length > 0}>
          <Collapsible open={featuresOpen()} onOpenChange={setFeaturesOpen}>
            <CollapsibleTrigger class="flex items-center justify-between w-full py-2 text-left group">
              <span class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Key Features
                <span class="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({props.overview.features.length})
                </span>
              </span>
              <ChevronDown
                class={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  featuresOpen() ? 'rotate-180' : ''
                }`}
                stroke-width={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul class="space-y-2 pt-2 ml-1">
                <For each={props.overview.features}>
                  {(feature) => (
                    <li class="flex items-start gap-4">
                      <span class="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 mt-2 shrink-0" />
                      <span class="text-stone-700 dark:text-stone-300">
                        {feature}
                      </span>
                    </li>
                  )}
                </For>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Show>
      </CardContent>
    </Card>
  )
}
