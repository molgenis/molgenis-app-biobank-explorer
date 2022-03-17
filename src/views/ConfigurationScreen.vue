<template>
  <div class="container-fluid">
    <div class="row px-5 pb-3">
      <div ref="editor" class="editor" @keyup.ctrl.f="format"></div>
    </div>
    <div class="row px-5">
      <button class="btn btn-primary mr-3 save-button" @click="save">Save configuration</button>
      <button class="btn btn-dark" @click="cancel">Undo changes</button>
    </div>
    <div class="row px-5 mt-3" v-if="showNotification">
      <div class="col-md-12 p-0">
        <div
          v-if="configUpdateStatus === 204"
          class="alert alert-success"
          role="alert"
          @click="statusClosed = true">
          <span>Configuration saved!</span>
       <b class="float-right">X</b>
        </div>
        <div
          v-else
          class="alert alert-warning"
          role="alert"
          @click="statusClosed = true">
          <span>We could not save the configuration, make sure you are logged with
            sufficient rights.</span><b class="float-right">X</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      editor: {},
      statusClosed: true
    }
  },
  methods: {
    ...mapActions([
      'GetApplicationConfiguration',
      'SaveApplicationConfiguration'
    ]),
    format () {
      this.editor.getAction('editor.action.formatDocument').run()
    },
    save () {
      this.statusClosed = false
      this.SaveApplicationConfiguration(this.editor.getValue())
    },
    cancel () {
      this.editor.getModel().setValue(this.appConfig)
    }
  },
  computed: {
    ...mapState(['appConfig', 'configUpdateStatus']),
    showNotification () {
      return this.configUpdateStatus !== 0 && !this.statusClosed
    }
  },
  watch: {
    configUpdateStatus (newStatus) {
      if (newStatus !== 0) {
        const timer = setTimeout(() => { this.statusClosed = true; clearTimeout(timer) }, 5000)
      }
    }
  },
  async mounted () {
    this.GetApplicationConfiguration()
    const monaco = await import('monaco-editor/esm/vs/editor/editor.api')

    this.editor = monaco.editor.create(this.$refs.editor, {
      automaticLayout: true,
      value: this.appConfig,
      language: 'json'
    })

    this.format()
  }
}
</script>

<style scoped >
.editor {
  margin: 0 auto;
  border: 1px solid black;
  height: 65vh;
  width: 100%;
}

.alert:hover {
  cursor: pointer;
}

.save-button {
  width: 14rem;
}
</style>
