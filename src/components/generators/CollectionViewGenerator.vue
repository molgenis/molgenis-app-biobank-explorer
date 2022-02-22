<template>
  <div>
    <table class="mg-report-details-list mb-4">
      <component
        v-for="attribute in viewmodel"
        :is="component(attribute.type)"
        :attribute="attribute"
        :key="attribute.id"/>
    </table>

    <div
      v-if="collection.sub_collections && collection.sub_collections.length > 0"
      class="mt-3">
      <h3>Subcollections</h3>

      <subcollection
        v-for="subcollection of collection.sub_collections"
        :key="subcollection.id"
        :collection="subcollection"></subcollection>
    </div>
  </div>
</template>

<script>
import mref from './view-components/mref.vue'
import string from './view-components/string.vue'
import hyperlink from './view-components/hyperlink.vue'
import Subcollection from './view-components/Subcollection.vue'

export default {
  name: 'CollectionViewGenerator',
  components: {
    mref,
    string,
    hyperlink,
    Subcollection
  },
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  computed: {
    viewmodel () {
      return this.collection.viewmodel
    }
  },
  methods: {
    component (type) {
      switch (type) {
        case 'categoricalmref': {
          return 'mref'
        }
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
