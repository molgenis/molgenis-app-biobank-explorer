<template>
  <div class="search-box-container">
    <input type="text" class="form-control" id="search-box" v-model.lazy="search"
           placeholder="Search for biobanks and collections...">
    <hr>
  </div>
</template>

<style>
  .search-box-container {
    padding-top: 1em;
  }
</style>

<script>
  import { SET_SEARCH } from '../store/mutations'

  export default {
    name: 'search-box',
    data () {
      return {
        search: ''
      }
    },
    watch: {
      search (search) {
        this.$store.commit(SET_SEARCH, search)
      }
    }
  }
</script>
