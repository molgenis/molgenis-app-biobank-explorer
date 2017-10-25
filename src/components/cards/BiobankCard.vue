<template>
  <div class="card biobank-card">
    <div class="card-header biobank-header">
      <div class="d-flex justify-content-between">
        <router-link :to="{ name: 'biobank-report', params: { id: biobank.id}, query: query}">
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
      <div class="card">
        <div class="card-header collections-header" @click.prevent="toggle">
          <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
          <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
          Collections
        </div>
      </div>
      <div v-if="!collapsed">
      <collections-table
        v-if="biobank.collections.length > 0"
        :collections="biobank.collections">
      </collections-table>
      </div>
    </div>
  </div>
</template>

<style>
  .biobank-card {
    margin-bottom: 1em;
  }

  .biobank-header:hover {
    cursor: pointer;
  }

  .collections-header:hover {
    cursor: pointer;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable.vue'

  export default {
    name: 'biobank-card',
    props: ['biobank'],
    data () {
      return {
        collapsed: true
      }
    },
    methods: {
      toggle () {
        this.collapsed = !this.collapsed
      }
    },
    computed: {
      query () {
        return this.$route.query
      }
    },
    components: {
      CollectionsTable
    }
  }
</script>
