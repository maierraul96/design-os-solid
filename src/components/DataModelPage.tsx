import { createMemo, Show, For } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export default function DataModelPage() {
  const productData = createMemo(() => loadProductData())
  const dataModel = () => productData().dataModel

  const hasDataModel = () => !!dataModel()
  const stepStatus = (): StepStatus => hasDataModel() ? 'completed' : 'current'

  return (
    <AppLayout>
      <div class="space-y-6">
        {/* Page intro */}
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Data Model
          </h1>
          <p class="text-stone-600 dark:text-stone-400">
            Define the core entities and relationships in your product.
          </p>
        </div>

        {/* Step 1: Data Model */}
        <StepIndicator step={1} status={stepStatus()} isLast={!hasDataModel()}>
          <Show when={dataModel()} fallback={<EmptyState type="data-model" />}>
            {(dm) => (
              <div class="space-y-6">
                {/* Entities */}
                <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Entities
                      <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({dm().entities.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Show
                      when={dm().entities.length > 0}
                      fallback={<p class="text-stone-500 dark:text-stone-400">No entities defined.</p>}
                    >
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <For each={dm().entities}>
                          {(entity) => (
                            <div class="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4">
                              <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                                {entity.name}
                              </h3>
                              <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                                {entity.description}
                              </p>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </CardContent>
                </Card>

                {/* Relationships */}
                <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Relationships
                      <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({dm().relationships.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Show
                      when={dm().relationships.length > 0}
                      fallback={<p class="text-stone-500 dark:text-stone-400">No relationships defined.</p>}
                    >
                      <ul class="space-y-2">
                        <For each={dm().relationships}>
                          {(relationship) => (
                            <li class="flex items-start gap-3">
                              <span class="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                              <span class="text-stone-700 dark:text-stone-300">
                                {relationship}
                              </span>
                            </li>
                          )}
                        </For>
                      </ul>
                    </Show>
                  </CardContent>
                </Card>

                {/* Edit hint */}
                <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                  <p class="text-sm text-stone-600 dark:text-stone-400">
                    To update the data model, run{' '}
                    <code class="font-mono text-stone-800 dark:text-stone-200">/data-model</code>{' '}
                    or edit the file directly at{' '}
                    <code class="font-mono text-stone-800 dark:text-stone-200">
                      product/data-model/data-model.md
                    </code>
                  </p>
                </div>
              </div>
            )}
          </Show>
        </StepIndicator>

        {/* Next Phase Button - shown when all steps complete */}
        <Show when={hasDataModel()}>
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="design" />
          </StepIndicator>
        </Show>
      </div>
    </AppLayout>
  )
}
