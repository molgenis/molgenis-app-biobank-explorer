<template>
  <div class="search-box-container">
    <input type="text" class="form-control" id="search-box" v-model.lazy="search"
           placeholder="Search for biobanks and collections...">
    <small v-if="biobanks.length > 100"><i>More then 100 biobanks found, please refine your query</i></small>
    <small v-else><i>{{biobanks.length}} biobanks shown</i></small>
  </div>
</template>

<style>
  .search-box-container {
    padding-top: 1em;
    padding-bottom: 1em;
  }
</style>

<script>
  import { SET_SEARCH } from '../store/mutations'
  import { mapState } from 'vuex'

  export default {
    name: 'search-box',
    computed: {
      ...mapState(['biobanks']),
      search: {
        get () {
          return this.$store.state.search
        },
        set (search) {
          this.$store.commit(SET_SEARCH, search)
        }
      }
    }
  }
</script>
