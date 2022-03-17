<template>
  <div class="editor-container">
    <div ref="editor" class="editor"  @keyup.ctrl.f="format"></div>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      editor: {}
    }
  },
  methods: {
    ...mapActions(['GetApplicationConfiguration']),
    format () {
      this.editor.getAction('editor.action.formatDocument').run()
    }
  },
  computed: {
    ...mapState(['appConfig'])
  },
  async mounted () {
    this.GetApplicationConfiguration()
    const monaco = await import('monaco-editor/esm/vs/editor/editor.api')

    this.editor = monaco.editor.create(this.$refs.editor, {
      value: this.appConfig,
      language: 'json'
    })

    this.format()
  }
}
</script>

<style scoped >
.editor-container {
  margin: 0 auto;
  width: 90vw;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.editor {
  border: 1px solid black;
  height: 65vh;
  width: 100%;
}
</style>
