<template>
  <div>
    <b-button variant="primary" @click="showCart = !showCart"><span>{{ uiText["request"] }}</span><span class="badge badge-light ml-2">
        {{ selectedCollections.length }}</span></b-button>
    <negotiator-selection v-model="showCart" :bookmark="bookmark" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NegotiatorSelection from '../popovers/NegotiatorSelection.vue'

export default {
  components: {
    NegotiatorSelection
  },
  props: {
    bookmark: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  computed: {
    ...mapGetters([
      'selectedCollections',
      'uiText'
    ])
  },
  data: () => ({
    showCart: false
  })
}
</script>
