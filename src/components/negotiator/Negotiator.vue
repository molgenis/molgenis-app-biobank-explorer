<template>
  <button
    type="button"
    class="btn btn-secondary negotiator-btn"
    data-toggle="tooltip"
    data-placement="bottom"
    title="Send to the negotiator"
    @click="sendToNegotiator"
    :disabled="disabled"
  >
    REQUEST SAMPLES
    <i class="fa fa-spin fa-spinner" aria-hidden="true" v-if="loading"></i>
  </button>
</template>

<style>
.negotiator-btn {
  margin-bottom: 1rem;
}
</style>

<script>
import { SEND_TO_NEGOTIATOR } from '../../store/actions'

export default {
  name: 'negotiator',
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    done () {
      this.loading = false
    },
    sendToNegotiator () {
      this.loading = true
      this.$store.dispatch(SEND_TO_NEGOTIATOR).finally(this.done)
    }
  }
}
</script>
