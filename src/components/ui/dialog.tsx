import { splitProps, type JSX, type ParentComponent, createContext, useContext, createSignal, Show, type Accessor, onCleanup, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'
import { X } from 'lucide-solid'
import { cn } from '@/lib/utils'

// Context for dialog state
interface DialogContextValue {
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue>()

function useDialogContext() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog component')
  }
  return context
}

interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: JSX.Element
}

function Dialog(props: DialogProps) {
  const [internalOpen, setInternalOpen] = createSignal(props.defaultOpen || false)

  const open = () => props.open !== undefined ? props.open : internalOpen()
  const setOpen = (value: boolean) => {
    if (props.open === undefined) {
      setInternalOpen(value)
    }
    props.onOpenChange?.(value)
  }

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {props.children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogTrigger: ParentComponent<DialogTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'onClick'])
  const context = useDialogContext()

  return (
    <button
      data-slot="dialog-trigger"
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

function DialogClose(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [local, others] = splitProps(props, ['children', 'onClick'])
  const context = useDialogContext()

  return (
    <button
      data-slot="dialog-close"
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

interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean
}

const DialogContent: ParentComponent<DialogContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'showCloseButton'])
  const context = useDialogContext()
  const showClose = () => local.showCloseButton !== false

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
          data-slot="dialog-overlay"
          class="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0"
          onClick={() => context.setOpen(false)}
        />
        {/* Content */}
        <div
          data-slot="dialog-content"
          role="dialog"
          aria-modal="true"
          class={cn(
            'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg animate-in fade-in-0 zoom-in-95 sm:max-w-lg',
            local.class
          )}
          {...others}
        >
          {local.children}
          <Show when={showClose()}>
            <button
              data-slot="dialog-close"
              class="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              onClick={() => context.setOpen(false)}
            >
              <X class="size-4" />
              <span class="sr-only">Close</span>
            </button>
          </Show>
        </div>
      </Portal>
    </Show>
  )
}

const DialogHeader: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="dialog-header"
      class={cn('flex flex-col gap-2 text-center sm:text-left', local.class)}
      {...others}
    >
      {local.children}
    </div>
  )
}

const DialogFooter: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="dialog-footer"
      class={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

const DialogTitle: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <h2
      data-slot="dialog-title"
      class={cn('text-lg leading-none font-semibold', local.class)}
      {...others}
    >
      {local.children}
    </h2>
  )
}

const DialogDescription: ParentComponent<JSX.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <p
      data-slot="dialog-description"
      class={cn('text-muted-foreground text-sm', local.class)}
      {...others}
    >
      {local.children}
    </p>
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
