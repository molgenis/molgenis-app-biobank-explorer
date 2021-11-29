<template>
    <div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    collectionAttributes: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState(['collectionMetadataDictionary'])
  }
}
</script>
