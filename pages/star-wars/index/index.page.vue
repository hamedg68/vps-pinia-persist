<template>
  <h1>Star Wars Movies</h1>
  <ol>
    <li v-for="item in filmsStore.films" :key="item.id">
      <a :href="'/star-wars/' + item.id">{{ item.title }}</a> ({{ item.release_date }})
    </li>
  </ol>
  <p>Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.</p>
  <p>Data can be fetched by using the <code>onBeforeRender()</code> hook.</p>
</template>

<script lang="ts" setup>
import { onMounted, onServerPrefetch } from 'vue'
import { useCounter } from './counterStore'
import { useFilmsStore } from './filmsStore'
const filmsStore = useFilmsStore()

onServerPrefetch(async () => {
  await filmsStore.fetchStarWarsMovies()
})

onMounted(async () => {
  console.log('==>', 'list onMounted : ', filmsStore.films)

  if (!filmsStore.films) {
    console.log('==>', 'get list on browser side!')
    await filmsStore.fetchStarWarsMovies()
  }
})
</script>
