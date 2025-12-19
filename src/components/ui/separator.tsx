import { splitProps, type JSX } from 'solid-js'
import { cn } from '@/lib/utils'

interface SeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}

function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, ['class', 'orientation', 'decorative'])
  const orientation = () => local.orientation || 'horizontal'

  return (
    <div
      data-slot="separator"
      role={local.decorative ? 'none' : 'separator'}
      aria-orientation={local.decorative ? undefined : orientation()}
      data-orientation={orientation()}
      class={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        local.class
      )}
      {...others}
    />
  )
}

export { Separator }
