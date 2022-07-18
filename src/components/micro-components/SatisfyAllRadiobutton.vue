<template>
  <div class="mb-2 d-flex">
    <div class="ml-auto d-flex">
      <label for="all">
        <input
          type="radio"
          id="all"
          name="satisfy-selector"
          v-model="satisfy"
          value="all"/>
        {{ uiText["satisfyAll"] }}
      </label>
      <label for="any">
        <input
          type="radio"
          id="any"
          name="satisfy-selector"
          v-model="satisfy"
          value="any"/>
        {{ uiText["satisfyAny"] }}
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SatisfyAllRadiobutton',
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters(['uiText']),

    satisfy: {
      get () {
        // convert string to a boolean, because booleans in inputs are also converted to strings.
        return this.value ? 'all' : 'any'
      },
      set (value) {
        this.$emit('input', value === 'all')
      }
    }
  }
}
</script>

<style scoped>
div label:first-child {
  margin-right: 1rem;
}
input {
  position: relative;
  bottom: 1px;
}
</style>
