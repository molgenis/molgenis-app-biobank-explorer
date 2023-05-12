<template>
  <div class="container-fluid p-0 landingpage-editor">
    <div>
      <landingpage :key="revision" editable @open="openModal" />
    </div>

    <simple-modal :open="editorOpen" @save="save" @close="closeWithoutSaving">
      <div class="d-flex flex-column">
        <template v-if="section === 'landingpage-header'">
          <label>
            Header:
            <input type="text" v-model="newConfig.landingpage.page_header" />
          </label>
          <b>Searchbox</b>
          <label class="mt-2">
            Button text:
            <input
              type="text"
              v-model="newConfig.landingpage.page_search.buttonText"/>
          </label>
          <label>
            Placeholder:
            <input
              type="text"
              v-model="newConfig.landingpage.page_search.searchPlaceholder"/>
          </label>
          <label>
            Aria label:
            <input
              type="text"
              v-model="newConfig.landingpage.page_search.ariaLabel"/>
          </label>
        </template>

        <template v-if="section === 'landingpage-ctas'">
          <div
            :key="'cta-' + index"
            v-for="(_, index) in newConfig.landingpage.page_call_to_actions">
            <b>Call to Action {{ index + 1 }}</b>
            <label>
              Call to action html:
              <textarea
                v-model="
                  newConfig.landingpage.page_call_to_actions[index].bodyHtml
                "/>
            </label>

            <label>
              Call to action link:
              <input
                type="text"
                v-model="
                  newConfig.landingpage.page_call_to_actions[index].ctaUrl
                "/>
            </label>

            <label>
              Call to action button text:
              <input
                type="text"
                v-model="
                  newConfig.landingpage.page_call_to_actions[index].ctaText
                "/>
            </label>
          </div>
        </template>

        <template v-if="section === 'landingpage-biobank-spotlight'">
          <label>
            Header:
            <input
              type="text"
              v-model="newConfig.landingpage.page_biobank_spotlight.header"/>
          </label>
          <label>
            Biobank spotlight html (optional):
            <textarea
              v-model="newConfig.landingpage.page_biobank_spotlight.bodyHtml"/>
          </label>

          <label>
            Biobank id:
            <input
              type="text"
              v-model="newConfig.landingpage.page_biobank_spotlight.biobankId"/>
          </label>
          <label>
            Biobank name:
            <input
              type="text"
              v-model="newConfig.landingpage.page_biobank_spotlight.biobankName"/>
          </label>

          <label>
            Button text:
            <input
              type="text"
              v-model="newConfig.landingpage.page_biobank_spotlight.buttonText"/>
          </label>
        </template>

        <template v-if="section === 'landingpage-collection-spotlight'">
          <label>
            Header:
            <input
              type="text"
              v-model="newConfig.landingpage.page_collection_spotlight.header"/>
          </label>
          <div
            :key="'col-spot-' + index"
            v-for="(_, index) in newConfig.landingpage.page_collection_spotlight
              .collections">
            <b>Collection{{ index + 1 }}</b>

            <label>
              Collection id:
              <input
                type="text"
                v-model="
                  newConfig.landingpage.page_collection_spotlight.collections[
                    index
                  ].id
                "/>
            </label>

            <label>
              Collection name:
              <input
                type="text"
                v-model="
                  newConfig.landingpage.page_collection_spotlight.collections[
                    index
                  ].name
                "/>
            </label>

            <label>
              Collection link text:
              <input
                type="text"
                v-model="
                  newConfig.landingpage.page_collection_spotlight.collections[
                    index
                  ].linkText
                "/>
            </label>
          </div>
        </template>
      </div>
    </simple-modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Landingpage from '../../views/Landingpage.vue'
import SimpleModal from '../popovers/SimpleModal.vue'
export default {
  components: { Landingpage, SimpleModal },
  props: {
    currentConfig: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      revision: 0,
      diffEditor: {},
      originalConfig: '',
      newConfig: {},
      editorOpen: false,
      section: ''
    }
  },
  watch: {
    currentConfig (updatedConfig) {
      this.originalConfig = updatedConfig
      this.newConfig = JSON.parse(this.originalConfig)
      this.revision++
    }
  },
  methods: {
    ...mapMutations(['UpdateLandingpage']),
    openModal (section) {
      this.section = section
      this.editorOpen = true
    },
    save () {
      this.UpdateLandingpage(this.newConfig)
      this.$emit('save', JSON.stringify(this.newConfig))
      this.editorOpen = false
    },
    closeWithoutSaving (section) {
      const originalConfig = JSON.parse(this.originalConfig)

      switch (section) {
        case 'landinpage-header': {
          this.newConfig.page_header = originalConfig.page_header
          this.newConfig.page_search = originalConfig.page_search
          break
        }
      }
      this.editorOpen = false
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  mounted () {
    this.originalConfig = this.currentConfig
    this.newConfig = JSON.parse(this.originalConfig)
  }
}
</script>

<style scoped>
.landingpage-editor {
  position: relative;
}

label {
  display: flex;
  justify-content: space-between;
}
input,
textarea {
  margin-left: 1rem;
}
</style>
