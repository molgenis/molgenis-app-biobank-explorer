<template>
  <div class="search-box-container">
    <div class="input-group search-input-container">
      <input type="text" class="form-control search-input" v-model.lazy="search"
             placeholder="Search biobanks by name">
      <span class="input-group-addon search-input-addon"><i class="fa fa-search"></i></span>
    </div>
    <div class="row">
      <div class="col-md-12">
        <negotiator :disabled="biobanks.length ? biobanks.length > 100 : true"></negotiator>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <small class="biobank-number-report" v-if="biobanks.length > 100"><i><b>More than 100 biobanks found, please refine your query</b></i>
        </small>
        <small class="biobank-number-report" v-else><i>{{biobanks.length}} biobanks shown</i></small>
        <div class="divider"></div>
      </div>
    </div>
  </div>
</template>

<style>
  .divider {
    border-bottom: solid 1px black;
    width: 100%;
  }

  .search-input-container {
    margin-bottom: 1rem;
  }

  .search-input {
    border-radius: 1rem;
  }

  .search-box-container {
    margin-bottom: 1rem;
  }

  .search-input-addon:hover {
    cursor: pointer
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
