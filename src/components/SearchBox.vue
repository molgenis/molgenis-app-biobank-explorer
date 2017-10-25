<template>
  <div class="search-box-container">
    <div class="input-group search-box">
      <input type="text" class="form-control" id="search-box" v-model.lazy="search"
             placeholder="Search for biobanks and collections..." ref="search-bar">
      <span class="input-group-btn">
        <button class="btn btn-secondary" type="button"><i class="fa fa-search"></i></button>
      </span>
    </div>

    <small v-if="biobanks.length > 100"><i>More then 100 biobanks found, please refine your query</i></small>
    <small v-else><i>{{biobanks.length}} biobanks shown</i></small><br>

    <negotiator :disabled="biobanks.length > 100"></negotiator>
  </div>
</template>

<style>
  .search-box {
    margin-bottom: 1em;
  }

  .search-box-container {
    padding-bottom: 1em;
  }
</style>

<script>
  import Negotiator from './negotiator/Negotiator'

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
    },
    watch: {
      search (search) {
        const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {search: search.length === 0 ? undefined : search})
        this.$router.push({query: updatedRouteQuery})
      }
    },
    components: {
      Negotiator
    }
  }
</script>
