import { createPinia, Pinia } from 'pinia'
import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import PageShell from './PageShell.vue'
import type { Component, PageContext } from './types'
import { setPageContext } from './usePageContext'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export { createApp }

async function createApp(pageContext: PageContext) {
  const { Page } = pageContext

  let rootComponent: Component
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageContext.pageProps || {})
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => {
            return h(this.Page, this.pageProps)
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithWrapper)
  const store = createPinia()
  app.use(store)

  
  if (pageContext.isHydration) {
    // store.use(piniaPluginPersistedstate)
   
    store.state.value = pageContext.initialStoreState
    addPiniaPersist(store).then(() => {
    
    })
  } 

  
  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  return { app, store }
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj, ObjAddendum>(obj: Obj, objAddendum: ObjAddendum): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

function addPiniaPersist(store: Pinia) {
  const installPersistedStatePlugin = createPersistedState()
  return new Promise<void>((resolve, reject) => {
    store.use((context) => {
      installPersistedStatePlugin(context)
      resolve()
    })
  })
}
