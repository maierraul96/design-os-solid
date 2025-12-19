import { createSignal, Show, For } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, PanelTop, Square } from 'lucide-solid'
import { EmptyState } from '@/components/EmptyState'
import type { ParsedSpec } from '@/types/section'

interface SpecCardProps {
  spec: ParsedSpec | null
  sectionTitle?: string
}

export function SpecCard(props: SpecCardProps) {
  const [userFlowsOpen, setUserFlowsOpen] = createSignal(false)
  const [uiReqOpen, setUiReqOpen] = createSignal(false)

  // Empty state
  if (!props.spec) {
    return <EmptyState type="spec" />
  }

  return (
    <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
          {props.sectionTitle || 'Specification'}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        {/* Overview */}
        <Show when={props.spec.overview}>
          <p class="text-stone-600 dark:text-stone-400 leading-relaxed">
            {props.spec.overview}
          </p>
        </Show>

        {/* User Flows - Expandable */}
        <Show when={props.spec.userFlows.length > 0}>
          <Collapsible open={userFlowsOpen()} onOpenChange={setUserFlowsOpen}>
            <CollapsibleTrigger class="flex items-center justify-between w-full py-2 text-left group">
              <span class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                User Flows
                <span class="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({props.spec.userFlows.length})
                </span>
              </span>
              <ChevronDown
                class={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  userFlowsOpen() ? 'rotate-180' : ''
                }`}
                stroke-width={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul class="space-y-2 pt-2">
                <For each={props.spec.userFlows}>
                  {(flow) => (
                    <li class="flex items-start gap-3">
                      <span class="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 mt-2 shrink-0" />
                      <span class="text-stone-700 dark:text-stone-300 text-sm">
                        {flow}
                      </span>
                    </li>
                  )}
                </For>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Show>

        {/* UI Requirements - Expandable */}
        <Show when={props.spec.uiRequirements.length > 0}>
          <Collapsible open={uiReqOpen()} onOpenChange={setUiReqOpen}>
            <CollapsibleTrigger class="flex items-center justify-between w-full py-2 text-left group">
              <span class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                UI Requirements
                <span class="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({props.spec.uiRequirements.length})
                </span>
              </span>
              <ChevronDown
                class={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  uiReqOpen() ? 'rotate-180' : ''
                }`}
                stroke-width={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul class="space-y-2 pt-2">
                <For each={props.spec.uiRequirements}>
                  {(req) => (
                    <li class="flex items-start gap-3">
                      <span class="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 mt-2 shrink-0" />
                      <span class="text-stone-700 dark:text-stone-300 text-sm">
                        {req}
                      </span>
                    </li>
                  )}
                </For>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </Show>

        {/* Display Configuration */}
        <div class="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          {props.spec.useShell ? (
            <>
              <PanelTop class="w-4 h-4 text-stone-400 dark:text-stone-500" stroke-width={1.5} />
              <span class="text-sm text-stone-500 dark:text-stone-400">
                Displays inside app shell
              </span>
            </>
          ) : (
            <>
              <Square class="w-4 h-4 text-stone-400 dark:text-stone-500" stroke-width={1.5} />
              <span class="text-sm text-stone-500 dark:text-stone-400">
                Standalone page (no shell)
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
