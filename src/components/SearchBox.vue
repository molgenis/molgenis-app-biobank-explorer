<template>
  <div class="input-group" id="search_items">
    <input type="text" class="form-control" placeholder="Search for..." v-model="search"
           v-on:keyup.enter="submit(query)">

    <button class="btn btn-danger input-group-addon" @click="clear()">
      <i class="fa fa-times" aria-hidden="true"></i>
    </button>

    <button class="btn btn-primary input-group-addon" @click="submit(query)">
      <i class="fa fa-search" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style>
  #search_items {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .input-group-addon {
    border-radius: 50px;
    background-color: #ffffff;
  }

  .form-control {
    border-radius: 50px;
  }
</style>

<script>
  import { SET_SEARCH } from '../store/mutations'
  import { GET_BIOBANKS_AND_COLLECTIONS } from '../store/actions'

  export default {
    name: 'search-box',
    methods: {
      submit: function () {
        this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
      },
      clear: function () {
        this.$store.commit(SET_SEARCH, '')
        this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
      }
    },
    computed: {
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
