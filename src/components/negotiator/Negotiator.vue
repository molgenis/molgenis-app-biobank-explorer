<template>
  <button type="button" class="btn btn-primary btn-block" data-toggle="tooltip" data-placement="bottom"
          title="Send to the negotiator" @click="sendToNegotiator">
    Go to sample / data negotiation
  </button>
</template>

<script>
  import { SEND_TO_NEGOTIATOR } from '../../store/actions'

  export default {
    name: 'negotiator',
    methods: {
      sendToNegotiator () {
        this.$store.dispatch(SEND_TO_NEGOTIATOR)
      }
    }

  }
</script>
