<template>
  <div class="search-box-container">
    <div class="row">

      <div class="col-md-6">
        <input type="text" class="form-control" id="search-box" v-model.lazy="search"
               placeholder="Search for biobanks and collections...">
      </div>

      <div class="col-md-6">
        <div class="form-check">
          <label for="empty-collection-check">
            <input type="checkbox" class="form-check-input" id="empty-collection-check"
                   v-model="filterEmptyCollections">
            <small>Hide biobanks without collections</small>
          </label>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
  .search-box-container {
    padding-top: 1em;
  }
</style>

<script>
  import { GET_BIOBANKS_AND_COLLECTIONS } from '../store/actions'
  import { FILTER_EMPTY_COLLECTIONS } from '../store/mutations'

  export default {
    name: 'search-box',
    data () {
      return {
        search: '',
        filterEmptyCollections: false
      }
    },
    watch: {
      search (search) {
        this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS, search)
      },
      filterEmptyCollections () {
        this.$store.commit(FILTER_EMPTY_COLLECTIONS)
      }
    }
  }
</script>
