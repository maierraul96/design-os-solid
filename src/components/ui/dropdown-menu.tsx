import { splitProps, type JSX, type ParentComponent, createContext, useContext, createSignal, Show, type Accessor, onCleanup, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'
import { Check, ChevronRight, Circle } from 'lucide-solid'
import { cn } from '@/lib/utils'

// Context for dropdown menu state
interface DropdownMenuContextValue {
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
  triggerRef: { current: HTMLButtonElement | null }
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>()

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('DropdownMenu components must be used within a DropdownMenu component')
  }
  return context
}

interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: JSX.Element
}

function DropdownMenu(props: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = createSignal(props.defaultOpen || false)
  const triggerRef = { current: null as HTMLButtonElement | null }

  const open = () => props.open !== undefined ? props.open : internalOpen()
  const setOpen = (value: boolean) => {
    if (props.open === undefined) {
      setInternalOpen(value)
    }
    props.onOpenChange?.(value)
  }

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {props.children}
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

const DropdownMenuTrigger: ParentComponent<DropdownMenuTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'onClick'])
  const context = useDropdownMenuContext()

  return (
    <button
      ref={(el) => { context.triggerRef.current = el }}
      data-slot="dropdown-menu-trigger"
      aria-expanded={context.open()}
      aria-haspopup="menu"
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

interface DropdownMenuContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}

const DropdownMenuContent: ParentComponent<DropdownMenuContentProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'sideOffset', 'align'])
  const context = useDropdownMenuContext()
  let contentRef: HTMLDivElement | undefined

  // Position the dropdown
  createEffect(() => {
    if (context.open() && contentRef && context.triggerRef.current) {
      const trigger = context.triggerRef.current
      const rect = trigger.getBoundingClientRect()
      const offset = local.sideOffset || 4

      contentRef.style.top = `${rect.bottom + offset}px`

      if (local.align === 'end') {
        contentRef.style.right = `${window.innerWidth - rect.right}px`
        contentRef.style.left = 'auto'
      } else if (local.align === 'center') {
        const contentWidth = contentRef.offsetWidth
        contentRef.style.left = `${rect.left + (rect.width / 2) - (contentWidth / 2)}px`
      } else {
        contentRef.style.left = `${rect.left}px`
      }
    }
  })

  // Handle click outside and escape
  createEffect(() => {
    if (context.open()) {
      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef && !contentRef.contains(e.target as Node) &&
            context.triggerRef.current && !context.triggerRef.current.contains(e.target as Node)) {
          context.setOpen(false)
        }
      }
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          context.setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      onCleanup(() => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      })
    }
  })

  return (
    <Show when={context.open()}>
      <Portal>
        <div
          ref={contentRef}
          data-slot="dropdown-menu-content"
          role="menu"
          class={cn(
            'bg-popover text-popover-foreground fixed z-50 max-h-[var(--radix-dropdown-menu-content-available-height,300px)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md animate-in fade-in-0 zoom-in-95',
            local.class
          )}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  )
}

const DropdownMenuGroup: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['children'])
  return (
    <div data-slot="dropdown-menu-group" role="group" {...others}>
      {local.children}
    </div>
  )
}

interface DropdownMenuItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  variant?: 'default' | 'destructive'
  onSelect?: () => void
}

const DropdownMenuItem: ParentComponent<DropdownMenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'inset', 'variant', 'onSelect', 'onClick'])
  const context = useDropdownMenuContext()

  return (
    <div
      data-slot="dropdown-menu-item"
      data-inset={local.inset}
      data-variant={local.variant || 'default'}
      role="menuitem"
      tabIndex={0}
      class={cn(
        'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        local.class
      )}
      onClick={(e) => {
        local.onSelect?.()
        context.setOpen(false)
        if (typeof local.onClick === 'function') {
          (local.onClick as JSX.EventHandler<HTMLDivElement, MouseEvent>)(e)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          local.onSelect?.()
          context.setOpen(false)
        }
      }}
      {...others}
    >
      {local.children}
    </div>
  )
}

interface DropdownMenuCheckboxItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const DropdownMenuCheckboxItem: ParentComponent<DropdownMenuCheckboxItemProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'checked', 'onCheckedChange', 'onClick'])
  const context = useDropdownMenuContext()

  return (
    <div
      data-slot="dropdown-menu-checkbox-item"
      role="menuitemcheckbox"
      aria-checked={local.checked}
      tabIndex={0}
      class={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        local.class
      )}
      onClick={(e) => {
        local.onCheckedChange?.(!local.checked)
        if (typeof local.onClick === 'function') {
          (local.onClick as JSX.EventHandler<HTMLDivElement, MouseEvent>)(e)
        }
      }}
      {...others}
    >
      <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <Show when={local.checked}>
          <Check class="size-4" />
        </Show>
      </span>
      {local.children}
    </div>
  )
}

interface DropdownMenuLabelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const DropdownMenuLabel: ParentComponent<DropdownMenuLabelProps> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children', 'inset'])
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={local.inset}
      class={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

const DropdownMenuSeparator: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class'])
  return (
    <div
      data-slot="dropdown-menu-separator"
      role="separator"
      class={cn('bg-border -mx-1 my-1 h-px', local.class)}
      {...others}
    />
  )
}

const DropdownMenuShortcut: ParentComponent<JSX.HTMLAttributes<HTMLSpanElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      class={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        local.class
      )}
      {...others}
    >
      {local.children}
    </span>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
