<template>
  <button type="button" class="btn btn-primary float-right" data-toggle="tooltip" data-placement="bottom"
          title="Send to the negotiator" @click="sendToNegotiator" :disabled="disabled">
    Go to sample / data negotiation
  </button>
</template>

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
    methods: {
      sendToNegotiator () {
        this.$store.dispatch(SEND_TO_NEGOTIATOR)
      }
    }

  }
</script>
