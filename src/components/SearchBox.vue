<template>
  <div class="search-box-container">
    <input type="text" class="form-control" id="search-box" v-model.lazy="search"
           placeholder="Search for biobanks and collections...">
  </div>
</template>

<style>
  .search-box-container {
    padding-top: 1em;
  }
</style>

<script>
  import { GET_BIOBANKS_AND_COLLECTIONS } from '../store/actions'
  import { SET_SEARCH } from '../store/mutations'

  export default {
    name: 'search-box',
    computed: {
      search: {
        get () {
          return this.$store.state.search
        },
        set () {
          this.$store.commit(SET_SEARCH)
        }
      }
    },
    watch: {
      search (search) {
        this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS, search)
      }
    }
  }
</script>
