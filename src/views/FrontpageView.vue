<template>
  <main>
    <section class="d-flex justify-content-center">
      <frontpage-header :header-text="'BBMRI-Eric Directory'">
        <frontpage-search />
      </frontpage-header>
    </section>
    <section class="d-flex justify-content-between mx-5 my-5 cta-container">
      <frontpage-call-to-action :ctaUrl="'#'" :ctaText="'Learn how'">
        <h2>Submit data</h2>
        <p>Make your data accessible</p>
      </frontpage-call-to-action>
      <frontpage-call-to-action :ctaUrl="'#'" :ctaText="'References'">
        <h2>References</h2>
        <p>Manuals &amp; templates</p>
      </frontpage-call-to-action>
      <frontpage-call-to-action :ctaUrl="'#'" :ctaText="'Support'">
        <h2>Support</h2>
        <p>Contact the servicedesk</p>
      </frontpage-call-to-action>
    </section>
  </main>
</template>

<script>
import FrontpageCallToAction from '../components/frontpage-components/FrontpageCallToAction.vue'
import FrontpageHeader from '../components/frontpage-components/FrontpageHeader.vue'
import FrontpageSearch from '../components/frontpage-components/FrontpageSearch.vue'

export default {
  components: { FrontpageHeader, FrontpageSearch, FrontpageCallToAction }
}
</script>

<style scoped>
</style>
