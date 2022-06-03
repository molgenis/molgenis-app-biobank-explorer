<template>
  <div>
    <div class="mb-3">
      <h3>Filters</h3>
      <small>Rearrange the filters by dragging and dropping. Unchecking a filter means it will be hidden by default.</small>
    </div>
    <draggable
      :list="appConfig.filterFacets"
      class="list-group"
      ghost-class="ghost"
      @start="dragging = true"
      @end="sync()">
      <div
        @click="activeFilter = element.name"
        class="list-group-item d-flex"
        v-for="(element, index) in appConfig.filterFacets"
        :key="element.name">
        {{ index }}. {{ element.label || element.name }}
        <small class="ml-auto" v-if="element.builtIn">Rearranging this has no effect in the application.</small>
       <label v-if="!element.builtIn" class="ml-auto"><input type="checkbox" v-model="appConfig.filterFacets[index].showFacet" @change="sync"></label>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'simple',
  components: {
    draggable
  },
  props: {
    config: {
      type: [String, Object],
      required: () => true
    },
    undo: {
      type: Number,
      required: () => false
    }
  },
  data () {
    return {
      appConfig: {},
      activeFilter: '',
      dragging: false
    }
  },
  watch: {
    undo (newValue) {
      if (newValue) {
        this.setData()
      }
    },
    config () {
      this.setData()
    }
  },
  methods: {
    setData () {
      if (typeof this.config === 'string' && this.config) {
        this.appConfig = JSON.parse(this.config)
      } else this.appConfig = Object.assign({}, this.config)
    },
    sync () {
      this.draggable = false
      this.$emit('update', this.appConfig)
    }
  },
  mounted () {
    this.setData()
  }
}
</script>
<style scoped>
.list-group-item:hover {
  cursor: grab;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
