<template>
  <div class="card filter-card">
    <div class="card-header filter-header" @click.prevent="collapsed = !collapsed">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      {{label}}
    </div>
    <div class="card-body" v-if="!collapsed">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          :placeholder="placeholder"
          :aria-label="label"
          v-model="model"
          @keyup.enter="send()"
        />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click.prevent="clearModel()">x</button>
        </div>
      </div>
      <small v-if="description" class="form-text text-muted">{{description}}</small>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      collapsed: this.initiallyCollapsed,
      model: ''
    }
  },
  props: {
    label: String,
    description: String,
    placeholder: String,
    value: String,
    initiallyCollapsed: Boolean
  },
  methods: {
    clearModel () {
      this.model = ''
      this.send()
    },
    send () {
      this.$emit('input', this.model)
    }
  },
  watch: {
    value (newValue) {
      this.model = newValue
    }
  },
  mounted () {
    this.model = this.value
  }
}
</script>
