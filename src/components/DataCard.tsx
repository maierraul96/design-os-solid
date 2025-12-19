import { createSignal, Show, For } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-solid'
import { EmptyState } from '@/components/EmptyState'

interface DataMeta {
  models: Record<string, string>
  relationships: string[]
}

interface DataCardProps {
  data: Record<string, unknown> | null
}

function extractMeta(data: Record<string, unknown>): DataMeta | null {
  const meta = data._meta as DataMeta | undefined
  if (meta && typeof meta === 'object' && meta.models && meta.relationships) {
    return meta
  }
  return null
}

function getDataWithoutMeta(data: Record<string, unknown>): Record<string, unknown> {
  const { _meta, ...rest } = data
  return rest
}

function countRecords(data: Record<string, unknown>): number {
  // Count arrays at the top level as record collections (excluding _meta)
  let count = 0
  for (const [key, value] of Object.entries(data)) {
    if (key !== '_meta' && Array.isArray(value)) {
      count += value.length
    }
  }
  return count
}

export function DataCard(props: DataCardProps) {
  const [isJsonOpen, setIsJsonOpen] = createSignal(false)

  // Empty state
  if (!props.data) {
    return <EmptyState type="data" />
  }

  const meta = () => extractMeta(props.data!)
  const dataWithoutMeta = () => getDataWithoutMeta(props.data!)
  const recordCount = () => countRecords(props.data!)

  return (
    <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader class="pb-4">
        <div class="flex items-center gap-3">
          <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Sample Data
          </CardTitle>
          <Show when={recordCount() > 0}>
            <span class="text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
              {recordCount()} {recordCount() === 1 ? 'record' : 'records'}
            </span>
          </Show>
        </div>
      </CardHeader>
      <CardContent class="pt-0 space-y-4">
        {/* Data Model Descriptions */}
        <Show when={meta()}>
          {(metaData) => (
            <div class="space-y-6">
              {/* Models - Card Grid */}
              <div>
                <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
                  Data Models
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <For each={Object.entries(metaData().models)}>
                    {([modelName, description]) => (
                      <div class="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4">
                        <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                          {modelName}
                        </h3>
                        <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                          {description}
                        </p>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Relationships */}
              <Show when={metaData().relationships.length > 0}>
                <div>
                  <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
                    How They Connect
                  </h4>
                  <ul class="space-y-2">
                    <For each={metaData().relationships}>
                      {(relationship) => (
                        <li class="text-stone-700 dark:text-stone-300 flex items-start gap-3">
                          <span class="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                          {relationship}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </Show>
            </div>
          )}
        </Show>

        {/* Collapsible JSON View */}
        <Collapsible open={isJsonOpen()} onOpenChange={setIsJsonOpen}>
          <CollapsibleTrigger class="flex items-center gap-2 text-left group">
            <ChevronDown
              class={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                isJsonOpen() ? 'rotate-180' : ''
              }`}
              stroke-width={1.5}
            />
            <span class="text-xs text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
              {isJsonOpen() ? 'Hide' : 'View'} JSON
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div class="bg-stone-50 dark:bg-stone-900 rounded-md p-4 overflow-x-auto mt-3">
              <pre class="text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                {JSON.stringify(dataWithoutMeta(), null, 2)}
              </pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
