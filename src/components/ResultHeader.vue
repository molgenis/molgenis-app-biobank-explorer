<template>
  <div class="search-box-container">
    <div class="row">
      <div class="col-md-12">
        <negotiator :disabled="!rsql.length || !biobanks.length"></negotiator>
      </div>
    </div>

    <div class="row>">
      <div class="col-md-12">
        <active-filter-list></active-filter-list>
      </div>
    </div>

    <div class="row" v-if="!loading">
      <div class="col-md-12">
        <div class="biobank-number-report-container">
          <small class="biobank-number-report">
            <i>{{biobanks.length}} biobanks found</i>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .biobank-number-report-container {
    border-bottom: solid 1px black;
    width: 100%;
  }

  .search-input-container {
    margin-bottom: 1rem;
  }

  .search-box-container {
    margin-bottom: 1rem;
  }

  .search-input-addon:hover {
    cursor: pointer
  }
</style>

<script>
  import Negotiator from '@/components/negotiator/Negotiator'
  import ActiveFilterList from '@/components/filters/ActiveFilterList'

  import { mapGetters } from 'vuex'

  export default {
    name: 'search-box',
    computed: {
      ...mapGetters(['biobanks', 'loading', 'rsql'])
    },
    components: {
      ActiveFilterList,
      Negotiator
    }
  }
</script>
