<template>
  <div>
    <b-form-checkbox
      id="covidBiobankNetwork"
      :checked="biobankNetwork"
      @change="setBiobankNetwork($event)"
      name="covidBiobankNetwork">
      Biobanks providing COVID-19 services
    </b-form-checkbox>
    <b-form-checkbox
      id="covidCollectionNetwork"
      :checked="collectionNetwork"
      @change="setCollectionNetwork($event)"
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
    ...mapMutations(['UpdateFilterSelection']),

    setBiobankNetwork (checked) {
      let biobankNetworkSelection = this.filters.selections.biobank_network || []

      if (checked && !biobankNetworkSelection.includes(covid19NetworkId)) {
        biobankNetworkSelection.push(covid19NetworkId)
      } else {
        biobankNetworkSelection = biobankNetworkSelection.filter(network => network !== covid19NetworkId)
      }
      this.UpdateFilterSelection({ name: 'biobank_network', value: biobankNetworkSelection })
    },
    setCollectionNetwork (checked) {
      let collectionNetworkSelection = this.filters.selections.collection_network || []

      if (checked && !collectionNetworkSelection.includes(covid19NetworkId)) {
        collectionNetworkSelection.push(covid19NetworkId)
      } else {
        collectionNetworkSelection = collectionNetworkSelection.filter(network => network !== covid19NetworkId)
      }

      this.UpdateFilterSelection({ name: 'collection_network', value: collectionNetworkSelection })
    }
  },
  computed: {
    ...mapState(['filters']),
    biobankNetwork: {
      get () {
        const network = this.filters.selections.biobank_network
        if (network && network.length > 0 && network.includes(covid19NetworkId)) {
          return true
        }
        return false
      }
    },
    collectionNetwork: {
      get () {
        const network = this.filters.selections.collection_network
        if (network && network.length > 0 && network.includes(covid19NetworkId)) {
          return true
        }
        return false
      }
    }
  }
}
</script>
