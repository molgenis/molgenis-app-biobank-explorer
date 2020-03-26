<template>
  <div class="card filter-card">
    <div class="card-header filter-header" @click.prevent="collapsed = !collapsed">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      {{label}}
    </div>
    <div class="card-body" v-if="!collapsed">
        <div class="input-group">
          <input type="text" class="form-control"
                 :placeholder="placeholder"
                 :aria-label="label"
                 v-model.lazy="model"
                 @keyup.enter="$emit('change')">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary"
                    type="button"
                    @click.prevent="model=''">x</button>
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
        collapsed: this.initiallyCollapsed
      }
    },
    props: {
      label: String,
      description: String,
      placeholder: String,
      value: String,
      initiallyCollapsed: Boolean
    },
    computed: {
      model: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    }
  }
</script>
