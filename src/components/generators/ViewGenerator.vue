<template>
  <div>
    <table class="mg-report-details-list mb-4">
      <component
        v-for="attribute in renderObject"
        :is="component(attribute.type)"
        :attribute="attribute"
        :key="attribute.id"/>
    </table>

    <div
      v-if="renderObject.sub_collections && renderObject.sub_collections.length > 0"
      class="mt-3">
      <h3>Subcollections</h3>

      <subcollection
        v-for="subcollection of renderObject.sub_collections"
        :key="subcollection.id"
        :collection="subcollection"></subcollection>
    </div>
  </div>
</template>

<script>
import mref from './view-components/mref.vue'
import array from './view-components/array.vue'
import string from './view-components/string.vue'
import hyperlink from './view-components/hyperlink.vue'
import Subcollection from './view-components/Subcollection.vue'

export default {
  name: 'ViewGenerator',
  components: {
    mref,
    array,
    string,
    hyperlink,
    Subcollection
  },
  props: {
    viewmodel: {
      type: Array,
      required: true
    }
  },
  computed: {
    renderObject () {
      return this.viewmodel
    }
  },
  methods: {
    component (type) {
      switch (type) {
        case 'categoricalmref': {
          return 'mref'
        }
        case 'array':
        case 'mref':
        case 'hyperlink': {
          return type
        }
        default: {
          return 'string'
        }
      }
    }
  }
}
</script>
