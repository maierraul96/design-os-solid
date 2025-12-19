import { Check, ArrowRight, AlertTriangle } from 'lucide-solid'
import type { JSX, ParentComponent } from 'solid-js'

export type StepStatus = 'completed' | 'current' | 'upcoming' | 'skipped'

interface StepIndicatorProps {
  step: number
  status: StepStatus
  isLast?: boolean
}

export const StepIndicator: ParentComponent<StepIndicatorProps> = (props) => {
  return (
    <div class="relative">
      {/* Vertical connecting line - extends from this step to the next */}
      {!props.isLast && (
        <div
          class="absolute left-[10px] top-[28px] w-[2px] h-[calc(100%+16px)] bg-stone-200 dark:bg-stone-700"
          aria-hidden="true"
        />
      )}

      {/* Step badge positioned at top-left */}
      <div class="absolute -left-[2px] top-0 z-10">
        <StepBadge step={props.step} status={props.status} />
      </div>

      {/* Card content with left padding to accommodate the step indicator */}
      <div class="pl-10">
        {props.children}
      </div>
    </div>
  )
}

interface StepBadgeProps {
  step: number
  status: StepStatus
}

function StepBadge(props: StepBadgeProps) {
  const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200"

  if (props.status === 'completed') {
    return (
      <div class={`${baseClasses} bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400`}>
        <Check class="w-3 h-3" stroke-width={2.5} />
      </div>
    )
  }

  if (props.status === 'current') {
    return (
      <div class={`${baseClasses} bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 shadow-sm`}>
        <ArrowRight class="w-3 h-3" stroke-width={2.5} />
      </div>
    )
  }

  if (props.status === 'skipped') {
    return (
      <div class={`${baseClasses} bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400`}>
        <AlertTriangle class="w-3 h-3" stroke-width={2.5} />
      </div>
    )
  }

  // upcoming
  return (
    <div class={`${baseClasses} bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400`}>
      {props.step}
    </div>
  )
}
