import { createMemo, Show, For } from 'solid-js'
import { useParams, useNavigate, A } from '@solidjs/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { PhaseWarningBanner } from '@/components/PhaseWarningBanner'
import { SpecCard } from '@/components/SpecCard'
import { DataCard } from '@/components/DataCard'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { loadProductData } from '@/lib/product-loader'
import { loadSectionData } from '@/lib/section-loader'
import { ChevronRight, Layout, Image, Download, ArrowRight, LayoutList } from 'lucide-solid'

function getStepStatuses(sectionData: ReturnType<typeof loadSectionData> | null): StepStatus[] {
  const hasSpec = !!sectionData?.specParsed
  const hasData = !!sectionData?.data
  const hasScreenDesigns = !!(sectionData?.screenDesigns && sectionData.screenDesigns.length > 0)
  const hasScreenshots = !!(sectionData?.screenshots && sectionData.screenshots.length > 0)

  const steps: boolean[] = [hasSpec, hasData, hasScreenDesigns, hasScreenshots]
  const firstIncomplete = steps.findIndex((done) => !done)

  return steps.map((done, index) => {
    if (done) return 'completed'
    if (index === firstIncomplete) return 'current'
    return 'upcoming'
  })
}

function areRequiredStepsComplete(sectionData: ReturnType<typeof loadSectionData> | null): boolean {
  const hasSpec = !!sectionData?.specParsed
  const hasData = !!sectionData?.data
  const hasScreenDesigns = !!(sectionData?.screenDesigns && sectionData.screenDesigns.length > 0)
  return hasSpec && hasData && hasScreenDesigns
}

export default function SectionPage() {
  const params = useParams<{ sectionId: string }>()
  const navigate = useNavigate()

  const productData = createMemo(() => loadProductData())
  const sections = () => productData().roadmap?.sections || []
  const section = () => sections().find((s) => s.id === params.sectionId)
  const currentIndex = () => sections().findIndex((s) => s.id === params.sectionId)

  const sectionData = createMemo(() => params.sectionId ? loadSectionData(params.sectionId) : null)

  const stepStatuses = () => getStepStatuses(sectionData())
  const requiredStepsComplete = () => areRequiredStepsComplete(sectionData())

  const isLastSection = () => currentIndex() === sections().length - 1 || currentIndex() === -1
  const nextSection = () => !isLastSection() ? sections()[currentIndex() + 1] : null

  return (
    <Show when={section()} fallback={
      <AppLayout backTo="/sections" backLabel="Sections">
        <div class="text-center py-12">
          <p class="text-stone-600 dark:text-stone-400">
            Section not found: {params.sectionId}
          </p>
        </div>
      </AppLayout>
    }>
      {(sec) => (
        <AppLayout backTo="/sections" backLabel="Sections" title={sec().title}>
          <div class="space-y-6">
            <div class="mb-8">
              <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {sec().title}
              </h1>
              <p class="text-stone-600 dark:text-stone-400">
                {sec().description}
              </p>
            </div>

            <PhaseWarningBanner />

            <StepIndicator step={1} status={stepStatuses()[0]}>
              <SpecCard spec={sectionData()?.specParsed || null} sectionTitle="Section Overview" />
            </StepIndicator>

            <StepIndicator step={2} status={stepStatuses()[1]}>
              <DataCard data={sectionData()?.data || null} />
            </StepIndicator>

            <StepIndicator step={3} status={stepStatuses()[2]}>
              <Show when={sectionData()?.screenDesigns && sectionData()!.screenDesigns.length > 0} fallback={<EmptyState type="screen-designs" />}>
                <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader class="pb-4">
                    <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Screen Designs
                      <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({sectionData()!.screenDesigns.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="p-0">
                    <ul class="divide-y divide-stone-200 dark:divide-stone-700">
                      <For each={sectionData()!.screenDesigns}>
                        {(screenDesign) => (
                          <li>
                            <A
                              href={`/sections/${params.sectionId}/screen-designs/${screenDesign.name}`}
                              class="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                            >
                              <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0">
                                  <Layout class="w-4 h-4 text-stone-600 dark:text-stone-300" stroke-width={1.5} />
                                </div>
                                <span class="font-medium text-stone-900 dark:text-stone-100 truncate">
                                  {screenDesign.name}
                                </span>
                              </div>
                              <ChevronRight class="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" stroke-width={1.5} />
                            </A>
                          </li>
                        )}
                      </For>
                    </ul>
                  </CardContent>
                </Card>
              </Show>
            </StepIndicator>

            <StepIndicator step={4} status={stepStatuses()[3]} isLast={!requiredStepsComplete()}>
              <Show when={sectionData()?.screenshots && sectionData()!.screenshots.length > 0} fallback={
                <Card class="border-stone-200 dark:border-stone-700 shadow-sm border-dashed">
                  <CardContent class="py-8">
                    <div class="flex flex-col items-center text-center max-w-sm mx-auto">
                      <div class="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
                        <Image class="w-5 h-5 text-stone-400 dark:text-stone-500" stroke-width={1.5} />
                      </div>
                      <h3 class="text-base font-medium text-stone-600 dark:text-stone-400 mb-1">
                        No screenshots captured yet
                      </h3>
                      <p class="text-sm text-stone-500 dark:text-stone-400 mb-4">
                        Capture screenshots of your screen designs for documentation
                      </p>
                      <div class="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5 w-full">
                        <p class="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
                          Run in Claude Code:
                        </p>
                        <code class="text-sm font-mono text-stone-700 dark:text-stone-300">
                          /screenshot-design
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              }>
                <Card class="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader class="pb-4">
                    <CardTitle class="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Screenshots
                      <span class="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({sectionData()!.screenshots.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="grid grid-cols-2 gap-4">
                      <For each={sectionData()!.screenshots}>
                        {(screenshot) => (
                          <div class="group">
                            <div class="aspect-video rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                              <img
                                src={screenshot.url}
                                alt={screenshot.name}
                                class="w-full h-full object-cover"
                              />
                            </div>
                            <div class="mt-2 flex items-center justify-between gap-2">
                              <p class="text-sm text-stone-600 dark:text-stone-400 truncate">
                                {screenshot.name}
                              </p>
                              <a
                                href={screenshot.url}
                                download={`${screenshot.name}.png`}
                                class="shrink-0 p-1.5 rounded-md text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                title="Download screenshot"
                              >
                                <Download class="w-4 h-4" stroke-width={1.5} />
                              </a>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </CardContent>
                </Card>
              </Show>
            </StepIndicator>

            <Show when={requiredStepsComplete()}>
              <StepIndicator step={5} status="current" isLast>
                <div class="space-y-3">
                  <Show when={nextSection()} fallback={
                    <button
                      onClick={() => navigate('/sections')}
                      class="w-full flex items-center justify-between gap-4 px-6 py-4 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors group"
                    >
                      <div class="flex items-center gap-3">
                        <LayoutList class="w-5 h-5" stroke-width={1.5} />
                        <span class="font-medium">Back to All Sections</span>
                      </div>
                      <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1" stroke-width={1.5} />
                    </button>
                  }>
                    {(next) => (
                      <>
                        <button
                          onClick={() => navigate(`/sections/${next().id}`)}
                          class="w-full flex items-center justify-between gap-4 px-6 py-4 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors group"
                        >
                          <div class="flex items-center gap-3">
                            <ArrowRight class="w-5 h-5" stroke-width={1.5} />
                            <span class="font-medium">Continue to {next().title}</span>
                          </div>
                          <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1" stroke-width={1.5} />
                        </button>
                        <button
                          onClick={() => navigate('/sections')}
                          class="w-full flex items-center justify-between gap-4 px-6 py-4 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors group"
                        >
                          <div class="flex items-center gap-3">
                            <LayoutList class="w-5 h-5" stroke-width={1.5} />
                            <span class="font-medium">View All Sections</span>
                          </div>
                          <ChevronRight class="w-5 h-5 transition-transform group-hover:translate-x-1" stroke-width={1.5} />
                        </button>
                      </>
                    )}
                  </Show>
                </div>
              </StepIndicator>
            </Show>
          </div>
        </AppLayout>
      )}
    </Show>
  )
}
