<template>
  <div>
    <b-form-checkbox
      id="covidBiobankNetwork"
      v-model="biobankNetwork"
      name="covidBiobankNetwork">
      Biobanks providing COVID-19 services
    </b-form-checkbox>
    <b-form-checkbox
      id="covidCollectionNetwork"
      v-model="collectionNetwork"
      name="covidCollectionNetwork">
      COVID-19 collections
    </b-form-checkbox>
  </div>
</template>

<script>
/* istanbul ignore file */

import { mapState, mapMutations } from 'vuex'
const covid19NetworkId = 'bbmri-eric:networkID:EU_BBMRI-ERIC:networks:COVID19'

export default {
  name: 'CovidNetworkFilter',
  methods: {
    ...mapMutations(['UpdateFilterSelection'])
  },
  computed: {
    ...mapState(['filters']),
    biobankNetwork: {
      get () {
        const network = this.filters.selections.biobank_network
        if (
          network &&
          network.length > 0 &&
          network.includes(covid19NetworkId)
        ) {
          return true
        }
        return false
      },
      set (checked) {
        const value = checked ? covid19NetworkId : []
        this.UpdateFilterSelection({ name: 'biobank_network', value: { text: 'COVID_19', value } })
      }
    },
    collectionNetwork: {
      get () {
        const network = this.filters.selections.collection_network
        if (
          network &&
          network.length > 0 &&
          network.includes(covid19NetworkId)
        ) {
          return true
        }
        return false
      },
      set (checked) {
        const value = checked ? covid19NetworkId : []
        this.UpdateFilterSelection({ name: 'collection_network', value: { text: 'COVID_19', value } })
      }
    }
  }
}
</script>
