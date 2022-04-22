<template>
  <div class="container-fluid">
    <a href="" ref="download" class="hidden"></a>
    <div class="row px-5 pb-3" @keyup.ctrl.f="format">
      <div ref="editor" class="editor" @keyup="dirty = true"></div>
    </div>
    <div class="row px-5">
      <div class="col pl-0">
        <button
          class="btn btn-primary mr-3 save-button"
          @click="save"
          :disabled="saveDisabled">
          Save configuration
        </button>
        <button class="btn btn-dark mr-3" @click="cancel">Undo changes</button>
        <button class="btn btn-outline-dark mr-3" @click="download">Download config</button>
        <button class="btn btn-outline-dark" @click="upload">Upload config</button>
        <input type="file" id="file-selector" accept=".json" @change="processUpload">
      </div>
      <div>
        <small class="float-right">To format your file press ctrl + f</small>
      </div>
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
          <span>We could not save the configuration, make sure you are logged in with
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
      statusClosed: true,
      dirty: false
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
      this.format()
      this.statusClosed = false
      this.SaveApplicationConfiguration(this.editor.getValue())
      this.dirty = false
    },
    cancel () {
      this.editor.getModel().setValue(this.appConfig)
    },
    download () {
      const file = new Blob([this.editor.getValue()], { type: 'json' })
      const a = document.createElement('a')
      const url = URL.createObjectURL(file)
      a.href = url
      a.download = `${window.location.host}-config.json`
      document.body.appendChild(a)
      a.click()
      setTimeout(function () {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 0)
    },
    upload () {
      const fileInput = document.getElementById('file-selector')
      fileInput.click()
    },
    processUpload (event) {
      const reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.editor.getModel().setValue(atob(event.target.result.split(',')[1]))
      })
      console.log(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    }
  },
  computed: {
    ...mapState(['appConfig', 'configUpdateStatus']),
    saveDisabled () {
      if (this.dirty) return false
      else return true
    },
    showNotification () {
      return this.configUpdateStatus !== 0 && !this.statusClosed
    }
  },
  watch: {
    configUpdateStatus (newStatus) {
      if (newStatus !== 0) {
        const timer = setTimeout(() => {
          this.statusClosed = true
          clearTimeout(timer)
        }, 5000)
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

    const formatTimer = setTimeout(() => {
      this.format()
      clearTimeout(formatTimer)
    }, 500)
  }
}
</script>

<style scoped >

#file-selector {
  display: none;
}

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
