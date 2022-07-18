<template>
  <div class="mb-2 d-flex">
    <div class="ml-auto d-flex">
      <label :for="idAll">
        <input
          type="radio"
          :id="idAll"
          :name="selector"
          v-model="satisfy"
          value="all"/>
        {{ uiText["satisfyAll"] }}
      </label>
      <label :for="idAny">
        <input
          type="radio"
          :id="idAny"
          :name="selector"
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
  data: function () {
    return {
      // need to generate random ids so that every filter has its own radiobutton group
      selector: new Date().getMilliseconds() + Math.random(),
      idAny: new Date().getMilliseconds() + Math.random(),
      idAll: new Date().getMilliseconds() + Math.random()
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
