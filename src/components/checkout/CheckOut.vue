<template>
  <div>
    <b-button variant="primary" @click="showCart = !showCart"><span>{{ uiText["request"] }}</span><span class="badge badge-light ml-2">
        {{ selectedCollections.length }}</span></b-button>
    <negotiator-selection v-model="showCart" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NegotiatorSelection from '../popovers/NegotiatorSelection.vue'

export default {
  components: {
    NegotiatorSelection
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
