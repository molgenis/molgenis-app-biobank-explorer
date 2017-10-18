<template>
  <div class="card biobank-card">

    <div class="card-header">
      <div class="d-flex justify-content-between">
        <h5>{{ biobank.name }}</h5>
      </div>
    </div>

    <div class="card-body">
      <collection-overview
        filterKey=""
        :collections="biobank.collections">
      </collection-overview>
    </div>
  </div>
</template>

<style>
  .biobank-card {
    margin-top: 1em;
  }
</style>

<script>
  import CollectionOverview from '../CollectionOverview'

  export default {
    name: 'biobank-card',
    props: ['biobank'],
    components: {
      CollectionOverview
    }
  }
</script>
