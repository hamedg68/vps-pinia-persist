import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vite-plugin-ssr'
import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { useFilmsStore } from '../pages/star-wars/index/filmsStore'

export { passToClient }
export { render }
export { onBeforeRender }

const passToClient = ['initialStoreState', 'pageProps', 'routeParams']

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { app, store } = createApp(pageContext)

  const stream = renderToNodeStream(app)

  const initialStoreState = store.state.value

  const documentHtml = escapeInject`<!DOCTYPE html>
  <html>
   
    <body>
      <div id="app">${stream}</div>
    </body>
  </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      initialStoreState
    }
  }
}

async function onBeforeRender() {
  // const store = useFilmsStore()

  // await store.fetchStarWarsMovies()

  // return {
  //   pageContext: {
  //     pageProps: {
  //       // We remove data we don't need because we pass `pageContext.movies` to
  //       // the client; we want to minimize what is sent over the network.
  //       movies: filterMoviesData(movies)
  //     },
  //     // The page's <title>
  //     // documentProps: { title: getTitle(movies) }
  //   }
  // }
}





