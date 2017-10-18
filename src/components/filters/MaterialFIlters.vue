<template>
  <div class="card">
    <div class="card-header"  @click.prevent="toggle">
      <i class="fa fa-caret-up" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      Materials
    </div>
    <div class="card-body" v-if="!collapsed">
      <div v-if="options.length > 0" v-for="option in options" class="form-check">
        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" :id="option.id" :value="option.id" v-model="filters">
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
  import { GET_MATERIALS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'

  export default {
    name: 'material-filters',
    data () {
      return {
        collapsed: true,
        filters: []
      }
    },
    methods: {
      toggle () {
        this.collapsed = !this.collapsed
      }
    },
    computed: {
      ...mapGetters({
        options: 'getMaterialOptions'
      })
    },
    watch: {
      filters (filters) {
        this.$store.commit(UPDATE_FILTER, {name: 'materials', filters: filters})
      }
    },
    beforeCreate () {
      this.$store.dispatch(GET_MATERIALS)
    }
  }
</script>
