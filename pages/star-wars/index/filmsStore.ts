import axios from 'axios'
import { defineStore } from 'pinia'
import type { Movie, MovieDetails } from '../types'

type Films = {
  films: Movie[] | undefined
}

export const useFilmsStore = defineStore({
  id: 'filmsStore',

  state: (): Films => ({
    films: undefined
  }),

  getters: {
    filterMoviesData() {
      return (movies: MovieDetails[]): Movie[] =>
        movies.map((movie: MovieDetails) => {
          const { title, release_date, id } = movie
          return { title, release_date, id }
        })
    }
  },

  actions: {
    async fetchStarWarsMovies() {
      const response = await axios.get('https://star-wars.brillout.com/api/films.json')

      let movies: MovieDetails[] = response.data.results

      this.films = this.filterMoviesData(movies)
    }
  },

  persist: {
    paths: ['films'],
  }


})
