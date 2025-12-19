import { lazy } from 'solid-js'
import { Route, Router } from '@solidjs/router'

// Lazy load pages for code splitting
const ProductPage = lazy(() => import('@/components/ProductPage'))
const DataModelPage = lazy(() => import('@/components/DataModelPage'))
const DesignPage = lazy(() => import('@/components/DesignPage'))
const SectionsPage = lazy(() => import('@/components/SectionsPage'))
const SectionPage = lazy(() => import('@/components/SectionPage'))
const ScreenDesignPage = lazy(() => import('@/components/ScreenDesignPage').then(m => ({ default: m.ScreenDesignPage })))
const ScreenDesignFullscreen = lazy(() => import('@/components/ScreenDesignPage').then(m => ({ default: m.ScreenDesignFullscreen })))
const ShellDesignPage = lazy(() => import('@/components/ShellDesignPage').then(m => ({ default: m.ShellDesignPage })))
const ShellDesignFullscreen = lazy(() => import('@/components/ShellDesignPage').then(m => ({ default: m.ShellDesignFullscreen })))
const ExportPage = lazy(() => import('@/components/ExportPage'))

export function AppRouter() {
  return (
    <Router>
      <Route path="/" component={ProductPage} />
      <Route path="/data-model" component={DataModelPage} />
      <Route path="/design" component={DesignPage} />
      <Route path="/sections" component={SectionsPage} />
      <Route path="/sections/:sectionId" component={SectionPage} />
      <Route path="/sections/:sectionId/screen-designs/:screenDesignName" component={ScreenDesignPage} />
      <Route path="/sections/:sectionId/screen-designs/:screenDesignName/fullscreen" component={ScreenDesignFullscreen} />
      <Route path="/shell/design" component={ShellDesignPage} />
      <Route path="/shell/design/fullscreen" component={ShellDesignFullscreen} />
      <Route path="/export" component={ExportPage} />
    </Router>
  )
}
