<template>
  <div class="card">
    <div class="card-header filter-header" @click.prevent="collapsed = !collapsed">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      Countries
    </div>
    <div class="card-body" v-if="!collapsed">
      <p class="text-right" @click.prevent="toggleSelect">
        <small v-if="filters.length === 0"><a href=""><i>Select all</i></a></small>
        <small v-if="filters.length > 0"><a href=""><i>Deselect all</i></a></small>
      </p>

      <div v-if="options.length > 0" v-for="(option, index) in options" class="form-check"
           v-show="index < 4 | showAllOptions">

        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" :id="option.id" :value="option.id" v-model="filters">
          {{ option.name }}
        </label>
      </div>

      <p class="text-right" @click.prevent="toggleAllOptions">
        <small v-if="!showAllOptions"><a href=""><i> Show more</i></a></small>
        <small v-else><a href=""><i>Show less</i></a></small>
      </p>
    </div>
  </div>
</template>

<script>
  import { GET_COUNTRY_OPTIONS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'

  export default {
    name: 'country-filters',
    data () {
      return {
        collapsed: false,
        showAllOptions: false
      }
    },
    methods: {
      toggleSelect () {
        this.filters = this.filters.length > 0 ? [] : this.$store.state.country.options.map(option => option.id)
      },
      toggleAllOptions () {
        this.showAllOptions = !this.showAllOptions
      }
    },
    computed: {
      ...mapGetters({
        options: 'getCountryOptions'
      }),
      filters: {
        get () {
          return this.$store.state.country.filters
        },
        set (filters) {
          this.$store.commit(UPDATE_FILTER, {name: 'country', filters: filters})
        }
      }
    },
    watch: {
      filters (filters) {
        const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {country: filters.length === 0 ? undefined : filters.join(',')})
        this.$router.push({query: updatedRouteQuery})
      }
    },
    mounted () {
      this.$store.dispatch(GET_COUNTRY_OPTIONS)
    }
  }
</script>
