<template>
  <div class="container-fluid p-0">
    <div>
      <landingpage />
    </div>

    <div class="row px-5 pb-5">
      <button class="btn btn-primary mr-3 save-button" @click="save">
        Save changes
      </button>
      <button class="btn btn-dark mr-3" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import Landingpage from '../../views/Landingpage.vue'
export default {
  components: { Landingpage },
  props: {
    currentConfig: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      diffEditor: {},
      newConfig: {}
    }
  },
  methods: {
    save () {
      this.$emit('save', this.newConfig)
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  mounted () {
    this.newConfig = JSON.parse(JSON.stringify(this.currentConfig))
  }
}
</script>

<style>
</style>
