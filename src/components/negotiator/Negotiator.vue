<template>
  <div>
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
  <b-modal id="podium-modal" title="Podium" @ok="sendRequest">
    <p class="my-4">Hello podium!</p>
    <p>Todo: podium tellingen vs niet podium tellingen?</p>
  </b-modal>
  </div>
</template>

<style>
.negotiator-btn {
  margin-bottom: 1rem;
}
</style>

<script>
import { SEND_TO_NEGOTIATOR } from '../../store/actions'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState(['isPodium'])
  },
  methods: {
    done () {
      this.loading = false
    },
    sendRequest () {
      this.$store.dispatch(SEND_TO_NEGOTIATOR).finally(this.done)
    },
    sendToNegotiator () {
      this.loading = true
      console.log('hello negotiator click')
      if (this.isPodium) {
        this.$bvModal.show('podium-modal')
      } else {
        this.sendRequest()
      }
    }
  }
}
</script>
