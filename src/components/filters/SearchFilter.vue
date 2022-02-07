<template>
  <StringFilter
    name="Search"
    v-model="search"
    placeholder="Search by name, id, acronym"></StringFilter>
</template>

<script>
import StringFilter from '../filters/StringFilter.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    StringFilter
  },
  computed: {
    ...mapGetters(['activeFilters']),
    search: {
      get () {
        return this.activeFilters.search
      },
      set (search) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }

        this.debounce = setTimeout(async () => {
          clearTimeout(this.debounce)
          this.UpdateFilterSelection({
            name: 'search',
            value: search
          })
        }, 500)
      }
    }
  },
  methods: {
    ...mapMutations(['UpdateFilterSelection'])
  }
}
</script>
