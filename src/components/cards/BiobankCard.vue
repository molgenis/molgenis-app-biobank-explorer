<template>
  <div class="card biobank-card">

    <div class="card-header biobank-header">
      <div class="d-flex justify-content-between">
        <router-link :to="{ name: 'biobank', params: { id: biobank.id}}">
          <h5>{{ biobank.name }}</h5>
        </router-link>
        <div>
          <small>
            <b>Country</b>: {{ biobank['country'].name }}
          </small>
        </div>
      </div>
    </div>

    <div class="card-body">
      <collections-table
        v-if="biobank.collections.length > 0"
        :collections="biobank.collections">
      </collections-table>
      <span v-else>No collections available...</span>
    </div>
  </div>
</template>

<style>
  .biobank-card {
    margin-top: 1em;
  }

  .biobank-header:hover {
    cursor: hand;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable.vue'

  export default {
    name: 'biobank-card',
    props: ['biobank'],
    components: {
      CollectionsTable
    }
  }
</script>
