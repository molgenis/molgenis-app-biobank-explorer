<template>
  <button
    @click="toggle"
    class="btn btn-outline-secondary"
    :class="selected ? 'bg-secondary text-white' : 'bg-white'">
    <input type="checkbox" :checked="selected" />
    {{ trueOption.text }}
  </button>
</template>

<script>
export default {
  props: {
    options: {
      type: [Function],
      required: true
    },
    trueOption: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selected: false
    }
  },
  watch: {
    value () {
      this.setValue()
    }
  },
  methods: {
    setValue () {
      if (this.value && this.value.length > 0) {
        this.selected = this.value[0] === 'true'
      } else {
        this.selected = false
      }
    },
    toggle () {
      /** because we toggle, if it is false now, it must become true: so emit */
      if (!this.selected) {
        this.$emit('input', this.trueOption)
      } else {
        /** remove the entry */
        this.$emit('input', undefined)
      }
    }
  },
  created () {
    this.setValue()
  }
}
</script>

<style scoped>
input {
  accent-color: var(--white);
}
button:hover {
  background-color: var(--secondary) !important;
}
</style>
