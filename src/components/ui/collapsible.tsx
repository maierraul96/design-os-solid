import { splitProps, type JSX, type ParentComponent, createContext, useContext, createSignal, Show, type Accessor } from 'solid-js'
import { cn } from '@/lib/utils'

// Context for collapsible state
interface CollapsibleContextValue {
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
}

const CollapsibleContext = createContext<CollapsibleContextValue>()

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext)
  if (!context) {
    throw new Error('Collapsible components must be used within a Collapsible component')
  }
  return context
}

interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const Collapsible: ParentComponent<CollapsibleProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'open', 'defaultOpen', 'onOpenChange'])
  const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen || false)

  const open = () => local.open !== undefined ? local.open : internalOpen()
  const setOpen = (value: boolean) => {
    if (local.open === undefined) {
      setInternalOpen(value)
    }
    local.onOpenChange?.(value)
  }

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div
        data-slot="collapsible"
        data-state={open() ? 'open' : 'closed'}
        class={cn(local.class)}
        {...others}
      >
        {local.children}
      </div>
    </CollapsibleContext.Provider>
  )
}

interface CollapsibleTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

const CollapsibleTrigger: ParentComponent<CollapsibleTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'onClick'])
  const context = useCollapsibleContext()

  return (
    <button
      data-slot="collapsible-trigger"
      type="button"
      aria-expanded={context.open()}
      data-state={context.open() ? 'open' : 'closed'}
      class={cn(local.class)}
      onClick={(e) => {
        context.setOpen(!context.open())
        if (typeof local.onClick === 'function') {
          local.onClick(e)
        }
      }}
      {...others}
    >
      {local.children}
    </button>
  )
}

const CollapsibleContent: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  const context = useCollapsibleContext()

  return (
    <Show when={context.open()}>
      <div
        data-slot="collapsible-content"
        data-state={context.open() ? 'open' : 'closed'}
        class={cn(
          'overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down',
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
