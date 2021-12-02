<template>
  <div>
    <table class="mg-report-details-list">
      <component
        v-for="attribute in viewmodel"
        :is="component(attribute.type)"
        :attribute="attribute"
        :key="attribute.id"/>
    </table>

    <div
      v-if="collection.sub_collections && collection.sub_collections.length > 0"
      class="mt-3">
      <h3>Sub collections</h3>

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
import Subcollection from './view-components/Subcollection.vue'

export default {
  name: 'CollectionViewGenerator',
  components: {
    mref,
    string,
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
        case 'mref':
        case 'categoricalmref': {
          return 'mref'
        }
        default: {
          return 'string'
        }
      }
    }
  }
}
</script>
