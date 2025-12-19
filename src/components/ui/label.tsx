import { splitProps, type JSX, type ParentComponent } from 'solid-js'
import { cn } from '@/lib/utils'

const Label: ParentComponent<JSX.LabelHTMLAttributes<HTMLLabelElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <label
      data-slot="label"
      class={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        local.class
      )}
      {...others}
    >
      {local.children}
    </label>
  )
}

export { Label }
