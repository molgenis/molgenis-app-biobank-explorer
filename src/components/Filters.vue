<template>
  <div class="card" id="categorical_filter">
    <p class="card-text">

      <categorical-filter v-for="(filter, id) in filters"
                          :key="filter.label"
                          :name="filter.label"
                          :options="filter.options"
                          :id="id">
      </categorical-filter>
    </p>
  </div>
</template>

<style>
  #categorical_filter {
    background-color: #f2f2f2;
    height: 100%
  }
</style>

<script>
  import CategoricalFilter from './CategoricalFilter'

  export default {
    name: 'filters',
    data: function () {
      return {
        filters: this.$store.state.filters
      }
    },
    components: {
      CategoricalFilter
    }
  }
</script>
