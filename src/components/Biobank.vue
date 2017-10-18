<template>
  <div>
    <div class="card biobank_card">
      <div class="card-header">
        <router-link :to="{ name: 'biobank', params: { id: biobank.id}, query: query}">
          <div class="card-block biobank_header">
            <div class="d-flex justify-content-between">
              <div>
                <h5>{{biobank.name}}</h5>
              </div>
              <div>
                <div v-for="key in keys">
                  <small v-if="typeof biobank[key] === 'object'"><b>{{capitalize(key)}}</b>: {{biobank[key].name}}
                  </small>
                  <small v-if="typeof biobank[key] === 'string' && biobank[key].length > 0"><b>{{capitalize(key)}}</b>: {{biobank[key]}}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <collection-overview
        filterKey=""
        :collections="biobank.collections">
      </collection-overview>
    </div>
  </div>
</template>

<style>
  .biobank_card {
    margin-top: 1em;
  }

  .biobank_header:hover {
    cursor: pointer;
    cursor: hand;
  }
</style>

<script>
  import CollectionOverview from './CollectionOverview'
  import { mapGetters } from 'vuex'

  export default {
    name: 'biobank',
    props: ['biobank'],
    data: function () {
      return {
        keys: ['country', 'acronym']
      }
    },
    methods: {
      capitalize: ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase()
    },
    computed: {
      ...mapGetters({query: 'getCompleteQuery'})
    },
    components: {CollectionOverview}
  }
</script>
