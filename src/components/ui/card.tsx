import { splitProps, type JSX, type ParentComponent } from 'solid-js'
import { cn } from '@/lib/utils'

const Card: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="card"
      class={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

const CardHeader: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="card-header"
      class={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

const CardTitle: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="card-title"
      class={cn('leading-none font-semibold', local.class)}
      {...others}
    >
      {local.children}
    </div>
  )
}

const CardDescription: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="card-description"
      class={cn('text-muted-foreground text-sm', local.class)}
      {...others}
    >
      {local.children}
    </div>
  )
}

const CardAction: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="card-action"
      class={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

const CardContent: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div data-slot="card-content" class={cn('px-6', local.class)} {...others}>
      {local.children}
    </div>
  )
}

const CardFooter: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <div
      data-slot="card-footer"
      class={cn('flex items-center px-6 [.border-t]:pt-6', local.class)}
      {...others}
    >
      {local.children}
    </div>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
