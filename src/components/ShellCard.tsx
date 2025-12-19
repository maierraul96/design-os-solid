import { createSignal, Show, For } from 'solid-js'
import { A } from '@solidjs/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, PanelLeft, Layout } from 'lucide-solid'
import type { ShellInfo } from '@/types/product'

interface ShellCardProps {
  shell: ShellInfo
}

export function ShellCard(props: ShellCardProps) {
  const [navigationOpen, setNavigationOpen] = createSignal(false)

  return (
    <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <PanelLeft class="w-5 h-5 text-stone-500 dark:text-stone-400" stroke-width={1.5} />
          Application Shell
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        {/* Overview */}
        <Show when={props.shell.spec?.overview}>
          <p class="text-stone-600 dark:text-stone-400 leading-relaxed">
            {props.shell.spec?.overview}
          </p>
        </Show>

        {/* Navigation - Collapsible */}
        <Show when={props.shell.spec && props.shell.spec.navigationItems.length > 0}>
          <Collapsible open={navigationOpen()} onOpenChange={setNavigationOpen}>
            <CollapsibleTrigger class="flex items-center justify-between w-full py-2 text-left group">
              <span class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Navigation
                <span class="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({props.shell.spec?.navigationItems.length || 0})
                </span>
              </span>
              <ChevronDown
                class={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  navigationOpen() ? 'rotate-180' : ''
                }`}
                stroke-width={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul class="space-y-2 pt-2 ml-1">
                <For each={props.shell.spec?.navigationItems || []}>
                  {(item) => (
                    <li class="flex items-start gap-3">
                      <span class="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                      <span class="text-stone-600 dark:text-stone-400">
                        {item}
                      </span>
                    </li>
                  )}
                </For>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Show>

        {/* View Shell Design Link */}
        <Show when={props.shell.hasComponents}>
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
      </CardContent>
    </Card>
  )
}
