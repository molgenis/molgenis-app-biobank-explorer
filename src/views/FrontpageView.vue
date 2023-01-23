<template>
  <main>
    <section class="d-flex justify-content-center">
      <frontpage-header :header-text="'BBMRI-ERIC Directory'">
        <frontpage-search />
      </frontpage-header>
    </section>
    <section class="d-flex justify-content-between mx-5 my-5 cta-container">
      <frontpage-call-to-action :ctaUrl="'#'" :ctaText="'Learn how'">
        <h2>BBMRI Directory</h2>
        <p>Make your biobank visible</p>
        <p>Make your collections accessible</p>
      </frontpage-call-to-action>
      <frontpage-call-to-action :ctaUrl="'#'" :ctaText="'References'">
        <h2>Services we offer</h2>
        <p>Manuals &amp; templates</p>
      </frontpage-call-to-action>
      <frontpage-call-to-action :ctaUrl="'#'" :ctaText="'Support'">
        <h2>Support</h2>
        <p>Contact the servicedesk</p>
      </frontpage-call-to-action>
    </section>
    <section class="ml-5 mb-5 d-flex">
      <frontpage-biobank-spotlight
        :headerText="'Biobank of interest'"
        :biobankName="'The Augsburg Central BioBank'"
        :biobankId="'bbmri-eric:ID:DE_ACBB'"/>
      <frontpage-new-collections
        class="ml-auto mr-5"
        :newCollections="[
          {
            id: 'bbmri-eric:ID:DE_BBM:collection:GHS',
            name: 'Gutenberg Health Study',
          },
          {
            id: 'bbmri-eric:ID:DE_BIOLIP:collection:NAPKON',
            name: 'Bioprobensammlung der Klinikum-Lippe GmbH',
          },
          {
            id: 'bbmri-eric:ID:DE_BioMaSOTA:collection:MainCollection',
            name:'Biobank der Medizinischen Fakultät der Universität Köln' ,
          },
          {
            id: 'bbmri-eric:ID:DE_BMBN:collection:Main_collection',
            name: 'Main Collection of the BioMaterial Bank Nord',
          },
        ]"/>
    </section>
  </main>
</template>

<script>
import FrontpageBiobankSpotlight from '../components/frontpage-components/FrontpageBiobankSpotlight.vue'
import FrontpageCallToAction from '../components/frontpage-components/FrontpageCallToAction.vue'
import FrontpageHeader from '../components/frontpage-components/FrontpageHeader.vue'
import FrontpageNewCollections from '../components/frontpage-components/FrontpageNewCollections.vue'
import FrontpageSearch from '../components/frontpage-components/FrontpageSearch.vue'

export default {
  components: {
    FrontpageHeader,
    FrontpageSearch,
    FrontpageCallToAction,
    FrontpageBiobankSpotlight,
    FrontpageNewCollections
  }
}
</script>

<style scoped>
</style>
