import { render } from 'solid-js/web'
import { Suspense } from 'solid-js'
import { AppRouter } from '@/lib/router'
import './index.css'

render(
  () => (
    <Suspense fallback={<div class="min-h-screen flex items-center justify-center text-stone-500">Loading...</div>}>
      <AppRouter />
    </Suspense>
  ),
  document.getElementById('root')!
)
