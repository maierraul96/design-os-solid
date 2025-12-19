import { splitProps, type JSX, type ParentComponent, createSignal, Show } from 'solid-js'
import { cn } from '@/lib/utils'

const Avatar: ParentComponent<JSX.HTMLAttributes<HTMLSpanElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <span
      data-slot="avatar"
      class={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        local.class
      )}
      {...others}
    >
      {local.children}
    </span>
  )
}

interface AvatarImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void
}

const AvatarImage = (props: AvatarImageProps) => {
  const [local, others] = splitProps(props, ['class', 'onLoadingStatusChange', 'onLoad', 'onError'])
  const [status, setStatus] = createSignal<'loading' | 'loaded' | 'error'>('loading')

  const handleLoad: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
    setStatus('loaded')
    local.onLoadingStatusChange?.('loaded')
    if (typeof local.onLoad === 'function') {
      local.onLoad(e)
    }
  }

  const handleError: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
    setStatus('error')
    local.onLoadingStatusChange?.('error')
    if (typeof local.onError === 'function') {
      local.onError(e)
    }
  }

  return (
    <Show when={status() !== 'error'}>
      <img
        data-slot="avatar-image"
        class={cn('aspect-square size-full', local.class)}
        onLoad={handleLoad}
        onError={handleError}
        {...others}
      />
    </Show>
  )
}

const AvatarFallback: ParentComponent<JSX.HTMLAttributes<HTMLSpanElement>> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children'])
  return (
    <span
      data-slot="avatar-fallback"
      class={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        local.class
      )}
      {...others}
    >
      {local.children}
    </span>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
