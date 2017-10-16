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
<style lang="scss">
  @import "~variables";
  @import "~mixins";

  #categorical_filter {
    background-color: $gray-lightest;
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
