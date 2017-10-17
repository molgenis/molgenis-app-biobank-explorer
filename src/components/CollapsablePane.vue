<template>
  <div class="card">
    <div class="card-header">
      <span @click.prevent="toggle">
        <i class="fa fa-caret-up" aria-hidden="true" v-if="collapsed"></i>
        <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
        More information
      </span>
    </div>
    <div class="card-body" v-if="!collapsed && biobank">
      <div v-for="(value, key, index) in biobank">
        <dl v-if="excluded.indexOf(key) === -1" class="row">
          <dt class="col-sm-3">{{ key }}</dt>
          <dd class="col-sm-9">{{ getTypedValue(value) }}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'collapsable-pane',
    props: ['biobank'],
    data () {
      return {
        collapsed: true,
        excluded: ['name', 'description', 'contact', 'collections', '_href']
      }
    },
    methods: {
      toggle () {
        this.collapsed = !this.collapsed
      },
      getTypedValue (value) {
        if (Array.isArray(value)) {
          return value.join(',')
        } else if (value.name !== undefined) {
          console.log(value.name)
          return value.name
        } else {
          return value
        }
      }
    }
  }
</script>
