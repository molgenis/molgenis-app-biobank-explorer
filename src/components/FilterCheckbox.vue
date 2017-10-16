<template>
  <div class="form-check filter_checkbox" v-show="index<4 | showAll">

    <label class="form-check-label">
      <input class="form-check-input" type="checkbox" v-model="value" :name="partOf">

      <div class="d-flex justify-content-between">
        <span v-if="label">{{label}}</span><span v-if="name">{{name}}</span>
      </div>
    </label>

  </div>
</template>

<style lang="scss">
  @import "~variables";
  @import "~mixins";

  .form-check-label {
    width: 100%;
  }

  .filter_checkbox {
    background-color: $white;
    padding: 0.3em;

  }
</style>

<script>
  import { SET_FILTER } from '../store/mutations'

  export default {
    name: 'filter-checkbox',
    props: ['id', 'name', 'label', 'index', 'showAll', 'partOf'],
    computed: {
      value: {
        get: function () {
          return this.$store.state.filters[this.partOf].selectedOptions.indexOf(this.id) !== -1
        },
        set: function (checked) {
          let filters = this.$store.state.filters[this.partOf].selectedOptions.slice()

          if (checked) {
            filters.push(this.id)
          } else {
            let index = filters.indexOf(this.id)
            filters.splice(index, 1)
          }

          this.$store.commit(SET_FILTER, {name: this.partOf, newSelectedOptions: filters})
        }
      }
    }
  }
</script>
