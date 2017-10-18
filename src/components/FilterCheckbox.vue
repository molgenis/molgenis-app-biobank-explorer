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

<style>
  .form-check-label {
    width: 100%;
  }

  .filter_checkbox {
    background-color: #ffffff;
    padding: 0.3em;
  }
</style>

<script>
  import { GET_BIOBANK_IDENTIFIERS } from '../store/actions'

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
          this.$store.dispatch(GET_BIOBANK_IDENTIFIERS, {options: filters, attribute: this.partOf})
        }
      }
    }
  }
</script>
