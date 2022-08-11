<template>
  <div class="container-fluid p-0">
    <nav class="navbar bg-dark justify-content-start mb-4">
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

    <div class="row">
      <div v-if="jsonError" class="alert alert-danger ml-5" role="alert">
        <span>{{ jsonError }}</span>
      </div>
    </div>

    <a href="" ref="download" class="hidden"></a>

    <div v-show="editorType === 'ui'" class="row px-5 pb-3">
      <div class="col-6">
        <FilterConfigUI
          :config="config"
          @update="updateFilters"
          @add="addFilter"
          @edit="setFilterEditIndex"/>
      </div>
      <div class="col-6" v-if="filterIndex !== -1">
        <h3>
          {{ config.filterFacets[this.filterIndex].label }} filter configuration
        </h3>
        <filter-editor
          class="filter-editor"
          :value="config.filterFacets[this.filterIndex]"
          @input="applyChanges"
          @delete="deleteFilter"/>
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
        <button v-if="dirty" class="btn btn-dark mr-3" @click="cancel">
          Cancel
        </button>

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
        <div class="row">
          <div v-show="showNotification">
            <div
              v-if="configUpdateStatus === 204"
              class="alert alert-success m-0 mr-3"
              role="alert"
              @click="statusClosed = true">
              <span>Configuration saved!</span>
            </div>
            <div
              v-else
              class="alert alert-warning m-0"
              role="alert"
              @click="statusClosed = true">
              <span>We could not save the configuration, make sure you are logged
                in with sufficient rights.</span>
            </div>
          </div>

          <div v-show="dirty" class="alert alert-warning m-0" role="alert">
            <span>You have unsaved changes</span>
          </div>
        </div>
        <small class="mt-4 float-right">To format your file press ctrl + f</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DiffEditor from '../components/configuration/DiffEditor.vue'
import FilterEditor from '../components/configuration/FilterEditor.vue'
import FilterConfigUI from '../components/configuration/FilterConfigUI.vue'
import { filterTemplate } from '../config/facetConfigurator'

export default {
  components: { FilterConfigUI, DiffEditor, FilterEditor },
  data () {
    return {
      editor: {},
      statusClosed: true,
      dirty: false,
      undoFilterSort: 0,
      editorType: 'ui', // ui / editor / diff
      newAppConfig: '',
      config: {},
      uploadedAppConfig: '',
      jsonError: '',
      filterIndex: -1
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
        this.editor.getModel().setValue(this.newAppConfig || this.appConfig)
        this.format()
      }

      if (view === 'ui') {
        this.config = JSON.parse(this.editor.getValue())
      }
    },
    format () {
      this.editor.getAction('editor.action.formatDocument').run()
    },
    applyChanges (filterObject) {
      this.dirty = true
      this.config.filterFacets[this.filterIndex] = filterObject
      this.syncCurrentConfigState()
    },
    deleteFilter () {
      this.dirty = true
      this.config.filterFacets.splice(this.filterIndex, 1)
      this.filterIndex = -1
      this.syncCurrentConfigState()
    },
    syncCurrentConfigState () {
      /**  apply config to draggables */
      this.config = Object.assign({}, this.config)
      /** apply changes to the json editor */
      this.newAppConfig = JSON.stringify(this.config)
    },
    save () {
      this.format()
      this.statusClosed = false
      if (this.editorType === 'editor') {
        this.saveToDatabase(this.editor.getValue())
      }
      if (this.editorType === 'ui') {
        this.saveToDatabase(this.newAppConfig)
      }
    },
    updateFilters (newConfig) {
      this.dirty = true
      this.newAppConfig = JSON.stringify(newConfig)
    },
    saveDiff (changesToSave) {
      this.newAppConfig = changesToSave
      this.saveToDatabase(changesToSave)

      this.switchView('editor')
    },
    checkJSONStructure (jsonString) {
      try {
        JSON.parse(jsonString)
        this.jsonError = ''
      } catch (e) {
        this.jsonError = e
      }
    },
    saveToDatabase (newConfiguration) {
      this.checkJSONStructure(newConfiguration)
      if (!this.jsonError) {
        this.SaveApplicationConfiguration(newConfiguration)
        this.dirty = false
      }
    },
    cancel () {
      this.dirty = false
      this.newAppConfig = ''

      this.config = Object.assign({}, JSON.parse(this.appConfig))
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
    async processUpload (event) {
      const reader = new FileReader()
      reader.addEventListener('load', event => {
        this.uploadedAppConfig = atob(event.target.result.split(',')[1])

        this.switchView('diff')
      })
      reader.readAsDataURL(event.target.files[0])
    },
    setFilterEditIndex (newIndex) {
      this.filterIndex = newIndex
    },
    addFilter () {
      const filterCount = this.config.filterFacets.length
      this.config.filterFacets.push(filterTemplate)
      this.syncCurrentConfigState()
      this.filterIndex = filterCount
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
  destroyed () {
    this.filterIndex = -1
  },
  async mounted () {
    await this.GetApplicationConfiguration()
    this.config = JSON.parse(this.appConfig)

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

.filter-editor {
  margin-top: 3.1rem;
  height: 40%;
  width: 100%;
  border: 1px solid black;
}

.alert:hover {
  cursor: pointer;
}

.save-button {
  width: 14rem;
}
</style>
