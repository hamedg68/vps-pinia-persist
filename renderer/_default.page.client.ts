import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

export const clientRouting = true
export const prefetchStaticAssets = { when: 'VIEWPORT' }
export { render }
export { onHydrationEnd }
export { onPageTransitionStart }
export { onPageTransitionEnd }

// let app: ReturnType<typeof createApp>
let app: any
async function render(pageContext: PageContextBuiltInClient & PageContext) {
  if (!app) {
    const instance = createApp(pageContext)
    app = instance.app    
    instance.store.state.value = pageContext.initialStoreState
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}


function onHydrationEnd() {
  console.log('Hydration finished; page is now interactive.')
}
function onPageTransitionStart() {
  console.log('Page transition start')
  document.querySelector('.content')!.classList.add('page-transition')
}
function onPageTransitionEnd() {
  console.log('Page transition end')
  document.querySelector('.content')!.classList.remove('page-transition')
}
