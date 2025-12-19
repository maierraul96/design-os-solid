import { createMemo, Show } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { loadProductData } from '@/lib/product-loader'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { ProductOverviewCard } from '@/components/ProductOverviewCard'
import { SectionsCard } from '@/components/SectionsCard'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'

/**
 * Determine the status of each step on the Product page
 * Steps: 1. Product Vision, 2. Roadmap
 */
function getProductPageStepStatuses(
  hasOverview: boolean,
  hasRoadmap: boolean
): StepStatus[] {
  const statuses: StepStatus[] = []

  // Step 1: Product Vision
  if (hasOverview) {
    statuses.push('completed')
  } else {
    statuses.push('current')
  }

  // Step 2: Roadmap
  if (hasRoadmap) {
    statuses.push('completed')
  } else if (hasOverview) {
    statuses.push('current')
  } else {
    statuses.push('upcoming')
  }

  return statuses
}

export default function ProductPage() {
  const navigate = useNavigate()
  const productData = createMemo(() => loadProductData())

  const hasOverview = () => !!productData().overview
  const hasRoadmap = () => !!productData().roadmap
  const allStepsComplete = () => hasOverview() && hasRoadmap()

  const stepStatuses = () => getProductPageStepStatuses(hasOverview(), hasRoadmap())

  return (
    <AppLayout>
      <div class="space-y-6">
        {/* Page intro */}
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Product Definition
          </h1>
          <p class="text-stone-600 dark:text-stone-400">
            Define your product vision and break it into development sections.
          </p>
        </div>

        {/* Step 1: Product Vision */}
        <div id="step-overview">
          <StepIndicator step={1} status={stepStatuses()[0]}>
            <Show when={productData().overview} fallback={<EmptyState type="overview" />}>
              {(overview) => <ProductOverviewCard overview={overview()} />}
            </Show>
          </StepIndicator>
        </div>

        {/* Step 2: Roadmap / Sections Definition */}
        <div id="step-roadmap">
          <StepIndicator step={2} status={stepStatuses()[1]} isLast={!allStepsComplete()}>
            <Show when={productData().roadmap} fallback={<EmptyState type="roadmap" />}>
              {(roadmap) => (
                <SectionsCard
                  roadmap={roadmap()}
                  onSectionClick={(sectionId) => navigate(`/sections/${sectionId}`)}
                />
              )}
            </Show>
          </StepIndicator>
        </div>

        {/* Next Phase Button - shown when all steps complete */}
        <Show when={allStepsComplete()}>
          <StepIndicator step={3} status="current" isLast>
            <NextPhaseButton nextPhase="data-model" />
          </StepIndicator>
        </Show>
      </div>
    </AppLayout>
  )
}
