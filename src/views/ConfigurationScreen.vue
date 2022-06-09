<template>
  <div class="container-fluid p-0">
    <nav class="navbar bg-dark justify-content-start">
      <button
        type="button"
        @click="switchView('ui')"
        class="btn btn-link text-white"
        :class="{ 'editor-active': editorType === 'ui' }">
        Filters
      </button>
      <button
        type="button"
        @click="switchView('editor')"
        class="btn btn-link text-white"
        :class="{ 'editor-active': editorType === 'editor' }">
        JSON Editor
      </button>
    </nav>

    <div class="row px-5 mt-3" v-show="showNotification">
      <div class="col-md-12 p-0">
        <div
          v-if="configUpdateStatus === 204"
          class="alert alert-success m-0"
          role="alert"
          @click="statusClosed = true">
          <span>Configuration saved!</span>
          <b class="float-right">X</b>
        </div>
        <div
          v-else
          class="alert alert-warning m-0"
          role="alert"
          @click="statusClosed = true">
          <span>We could not save the configuration, make sure you are logged in
            with sufficient rights.</span><b class="float-right">X</b>
        </div>
      </div>
    </div>
    <div class="row px-5 mt-3">
      <div class="col-md-12 p-0">
        <div v-if="dirty" class="alert alert-warning" role="alert">
          <span>You have unsaved changes</span>
        </div>
      </div>
    </div>

    <a href="" ref="download" class="hidden"></a>

    <div v-if="editorType === 'ui'" class="row px-5 pb-3">
      <div class="col-6">
        <FilterConfigUI
          :config="config"
          :undo="undoFilterSort"
          @update="updateFilters"/>
      </div>
    </div>

    <!-- Advanced Editor -->
    <div
      v-show="editorType === 'editor'"
      class="row px-5 pb-3"
      @keyup.ctrl.f="format">
      <div ref="editor" class="editor" @keyup="dirty = true"></div>
    </div>

    <diff-editor
      v-if="editorType === 'diff'"
      :currentConfig="currentConfig"
      :newConfig="uploadedAppConfig"
      @save="saveDiff"
      @cancel="switchView('editor')"/>
    <!-- End Advanced Editor -->

    <div v-if="editorType !== 'diff'" class="row px-5 pb-5">
      <div class="col pl-0">
        <button class="btn btn-primary mr-3 save-button" @click="save">
          Save configuration
        </button>
        <button class="btn btn-dark mr-3" @click="cancel">Undo changes</button>
        <button class="btn btn-outline-dark mr-3" @click="download">
          Download config
        </button>
        <button class="btn btn-outline-dark" @click="upload">
          Upload config
        </button>
        <input
          type="file"
          id="file-selector"
          accept=".json"
          @change="processUpload"/>
      </div>
      <div>
        <small class="float-right">To format your file press ctrl + f</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DiffEditor from '../components/configuration/DiffEditor.vue'
import FilterConfigUI from '../components/configuration/FilterConfigUI.vue'
export default {
  components: { FilterConfigUI, DiffEditor },
  data () {
    return {
      editor: {},
      statusClosed: true,
      dirty: false,
      undoFilterSort: 0,
      editorType: 'ui', // ui / editor / diff
      newAppConfig: '',
      config: '',
      uploadedAppConfig: ''
    }
  },
  methods: {
    ...mapActions([
      'GetApplicationConfiguration',
      'SaveApplicationConfiguration'
    ]),
    switchView (view) {
      const viewTimer = setTimeout(() => {
        this.editorType = view
        clearTimeout(viewTimer)
      }, 200)

      if (view === 'editor') {
        console.log('!!')
        this.editor.getModel().setValue(this.newAppConfig || this.appConfig)
        this.format()
      }

      if (view === 'ui') {
        this.config = this.editor.getValue()
      }
    },
    format () {
      this.editor.getAction('editor.action.formatDocument').run()
    },
    save () {
      this.format()
      this.statusClosed = false
      if (this.editorType === 'editor') {
        this.SaveApplicationConfiguration(this.editor.getValue())
      }
      if (this.editorType === 'ui') {
        this.SaveApplicationConfiguration(this.newAppConfig)
      }
      this.dirty = false
    },
    updateFilters (newConfig) {
      this.dirty = true
      this.newAppConfig = JSON.stringify(newConfig)
    },
    saveDiff (changesToSave) {
      this.newAppConfig = changesToSave
      this.SaveApplicationConfiguration(changesToSave)
      this.dirty = false
      this.switchView('editor')
    },
    cancel () {
      this.dirty = false
      switch (this.editorType) {
        case 'ui':
          this.undoFilterSort = new Date().getMilliseconds()
          break
        default:
          this.editor.getModel().setValue(this.appConfig)
      }
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
    async processUpload (event) {
      const reader = new FileReader()
      reader.addEventListener('load', event => {
        this.uploadedAppConfig = atob(event.target.result.split(',')[1])

        this.switchView('diff')
      })
      reader.readAsDataURL(event.target.files[0])
    }
  },
  computed: {
    ...mapState(['appConfig', 'configUpdateStatus']),
    showNotification () {
      return this.configUpdateStatus !== 0 && !this.statusClosed
    },
    currentConfig () {
      return this.editor.getValue()
    },
    newConfig () {
      return this.uploadedAppConfig
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
    await this.GetApplicationConfiguration()
    this.config = this.appConfig

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
.editor-active {
  text-decoration: underline;
}

.navbar {
  min-height: 3rem;
  padding-left: 2rem;
}

#file-selector {
  display: none;
}
::v-deep .original-in-monaco-diff-editor .view-lines,
::v-deep .original-in-monaco-diff-editor .margin-view-overlays {
  background-color: #eaeaea;
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
