import { splitProps, type JSX, type ParentComponent, createContext, useContext, createSignal, Show, type Accessor, onCleanup, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'
import { X } from 'lucide-solid'
import { cn } from '@/lib/utils'

// Context for sheet state
interface SheetContextValue {
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
}

const SheetContext = createContext<SheetContextValue>()

function useSheetContext() {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet component')
  }
  return context
}

interface SheetProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: JSX.Element
}

function Sheet(props: SheetProps) {
  const [internalOpen, setInternalOpen] = createSignal(props.defaultOpen || false)

  const open = () => props.open !== undefined ? props.open : internalOpen()
  const setOpen = (value: boolean) => {
    if (props.open === undefined) {
      setInternalOpen(value)
    }
    props.onOpenChange?.(value)
  }

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {props.children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

const SheetTrigger: ParentComponent<SheetTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'onClick'])
  const context = useSheetContext()

  return (
    <button
      data-slot="sheet-trigger"
      onClick={(e) => {
        context.setOpen(true)
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

function SheetClose(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [local, others] = splitProps(props, ['children', 'onClick'])
  const context = useSheetContext()

  return (
    <button
      data-slot="sheet-close"
      onClick={(e) => {
        context.setOpen(false)
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

interface SheetContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const SheetContent: ParentComponent<SheetContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'side'])
  const context = useSheetContext()
  const side = () => local.side || 'right'

  // Handle escape key
  createEffect(() => {
    if (context.open()) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          context.setOpen(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      onCleanup(() => document.removeEventListener('keydown', handleEscape))
    }
  })

  return (
    <Show when={context.open()}>
      <Portal>
        {/* Overlay */}
        <div
          data-slot="sheet-overlay"
          class="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0"
          onClick={() => context.setOpen(false)}
        />
        {/* Content */}
        <div
          data-slot="sheet-content"
          class={cn(
            'bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out animate-in',
            side() === 'right' && 'slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            side() === 'left' && 'slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            side() === 'top' && 'slide-in-from-top inset-x-0 top-0 h-auto border-b',
            side() === 'bottom' && 'slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
            local.class
          )}
          {...others}
        >
          {local.children}
          <button
            class="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
            onClick={() => context.setOpen(false)}
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      </Portal>
    </Show>
  )
}

const SheetHeader: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="sheet-header"
      class={cn('flex flex-col gap-1.5 p-4', local.class)}
      {...others}
    >
      {local.children}
    </div>
  )
}

const SheetFooter: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="sheet-footer"
      class={cn('mt-auto flex flex-col gap-2 p-4', local.class)}
      {...others}
    >
      {local.children}
    </div>
  )
}

const SheetTitle: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <h2
      data-slot="sheet-title"
      class={cn('text-foreground font-semibold', local.class)}
      {...others}
    >
      {local.children}
    </h2>
  )
}

const SheetDescription: ParentComponent<JSX.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <p
      data-slot="sheet-description"
      class={cn('text-muted-foreground text-sm', local.class)}
      {...others}
    >
      {local.children}
    </p>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
