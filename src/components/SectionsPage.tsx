import { createMemo, Show, For } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { PhaseWarningBanner } from '@/components/PhaseWarningBanner'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'
import { getSectionScreenDesigns, getSectionScreenshots, hasSectionSpec, hasSectionData } from '@/lib/section-loader'
import { ChevronRight, Check, Circle } from 'lucide-solid'

interface SectionProgress {
  hasSpec: boolean
  hasData: boolean
  hasScreenDesigns: boolean
  screenDesignCount: number
  hasScreenshots: boolean
  screenshotCount: number
}

function getSectionProgress(sectionId: string): SectionProgress {
  const screenDesigns = getSectionScreenDesigns(sectionId)
  const screenshots = getSectionScreenshots(sectionId)
  return {
    hasSpec: hasSectionSpec(sectionId),
    hasData: hasSectionData(sectionId),
    hasScreenDesigns: screenDesigns.length > 0,
    screenDesignCount: screenDesigns.length,
    hasScreenshots: screenshots.length > 0,
    screenshotCount: screenshots.length,
  }
}

export default function SectionsPage() {
  const navigate = useNavigate()
  const productData = createMemo(() => loadProductData())

  const sections = () => productData().roadmap?.sections || []

  const sectionProgressMap = createMemo(() => {
    const map: Record<string, SectionProgress> = {}
    for (const section of sections()) {
      map[section.id] = getSectionProgress(section.id)
    }
    return map
  })

  const completedSections = () => sections().filter(s => {
    const p = sectionProgressMap()[s.id]
    return p?.hasSpec && p?.hasData && p?.hasScreenDesigns
  }).length

  return (
    <AppLayout>
      <div class="space-y-6">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Sections
          </h1>
          <p class="text-stone-600 dark:text-stone-400">
            Design each section of your product with specifications, sample data, and screen designs.
          </p>
          <Show when={sections().length > 0}>
            <p class="text-sm text-stone-500 dark:text-stone-400 mt-2">
              {completedSections()} of {sections().length} sections completed
            </p>
          </Show>
        </div>

        <PhaseWarningBanner />

        <Show when={sections().length > 0} fallback={<EmptyState type="roadmap" />}>
          <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
            <CardHeader class="pb-2">
              <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                All Sections
              </CardTitle>
            </CardHeader>
            <CardContent class="p-0">
              <ul class="divide-y divide-stone-200 dark:divide-stone-700">
                <For each={sections()}>
                  {(section) => {
                    const progress = () => sectionProgressMap()[section.id]
                    const isComplete = () => progress()?.hasSpec && progress()?.hasData && progress()?.hasScreenDesigns

                    return (
                      <li>
                        <button
                          onClick={() => navigate(`/sections/${section.id}`)}
                          class="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                        >
                          <div class="flex items-start gap-4 min-w-0">
                            <div class="shrink-0 mt-0.5">
                              {isComplete() ? (
                                <div class="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                                  <Check class="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" stroke-width={2.5} />
                                </div>
                              ) : (
                                <div class="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                                  <span class="text-xs font-medium text-stone-600 dark:text-stone-400">
                                    {section.order}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div class="min-w-0 flex-1">
                              <h3 class="font-medium text-stone-900 dark:text-stone-100 truncate">
                                {section.title}
                              </h3>
                              <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                                {section.description}
                              </p>

                              <div class="flex items-center gap-3 mt-2">
                                <ProgressDot label="Spec" done={progress()?.hasSpec} />
                                <ProgressDot label="Data" done={progress()?.hasData} />
                                <ProgressDot
                                  label={progress()?.screenDesignCount ? `${progress()?.screenDesignCount} screen design${progress()?.screenDesignCount !== 1 ? 's' : ''}` : 'Screen Designs'}
                                  done={progress()?.hasScreenDesigns}
                                />
                                <ProgressDot
                                  label={progress()?.screenshotCount ? `${progress()?.screenshotCount} screenshot${progress()?.screenshotCount !== 1 ? 's' : ''}` : 'Screenshots'}
                                  done={progress()?.hasScreenshots}
                                  optional
                                />
                              </div>
                            </div>
                          </div>

                          <ChevronRight class="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" stroke-width={1.5} />
                        </button>
                      </li>
                    )
                  }}
                </For>
              </ul>
            </CardContent>
          </Card>
        </Show>

        <Show when={sections().length > 0 && completedSections() === sections().length}>
          <NextPhaseButton nextPhase="export" />
        </Show>
      </div>
    </AppLayout>
  )
}

interface ProgressDotProps {
  label: string
  done?: boolean
  optional?: boolean
}

function ProgressDot(props: ProgressDotProps) {
  return (
    <span class={`flex items-center gap-1 text-xs ${
      props.done
        ? 'text-stone-700 dark:text-stone-300'
        : props.optional
          ? 'text-stone-300 dark:text-stone-600'
          : 'text-stone-400 dark:text-stone-500'
    }`}>
      {props.done ? (
        <Check class="w-3 h-3 text-lime-600 dark:text-lime-400" stroke-width={2.5} />
      ) : (
        <Circle class={`w-3 h-3 ${props.optional ? 'opacity-50' : ''}`} stroke-width={1.5} />
      )}
      {props.label}
    </span>
  )
}
