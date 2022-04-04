<template>
  <div
    :class="[
      {
        'border-secondary': biobankInSelection,
        'border-light': !biobankInSelection,
      },
      'card biobank-card shadow-sm',
    ]">
    <div v-if="loading" class="text-center p-5">
      <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
    </div>
    <div v-else>
      <header class="border-0 card-header p-1">
        <h5 class="pt-1 pl-2 pr-1 mt-1">
          <router-link :to="'/biobank/' + biobank.id" title="Biobank details">
            <span class="biobank-name">{{ biobank.name }}</span>
            <font-awesome-icon
              class="float-right m-1 text-dark"
              :icon="['far', 'arrow-alt-circle-right']"/>
          </router-link>
        </h5>
      </header>

      <div class="d-flex mt-1" v-if="biobank.collections.length">
        <button
          class="btn ml-1"
          :class="{
            'btn-outline-secondary': !showCollections,
            'btn-light border': showCollections,
          }"
          @click.prevent="showCollections = false">
          Biobank details
        </button>

        <button
          class="btn ml-1"
          :class="{
            'btn-outline-secondary': showCollections,
            'btn-light border': !showCollections,
          }"
          @click.prevent="showCollections = true">
          Collections details
        </button>

        <collection-selector
          class="text-right ml-auto mr-2 align-self-center"
          v-if="biobank.collections.length > 0"
          :collectionData="biobank.collections"
          bookmark
          @checked="handleCheckAll"></collection-selector>
      </div>
      <section v-if="!showCollections" class="p-2 pt-1 biobank-section">
        <small>
          <view-generator :viewmodel="biobankcardViewmodel" />
        </small>
      </section>
      <section class="card-body collections-section pt-0">
        <div
          class="collection-items mt-4"
          v-for="collectionDetail of biobank.collectionDetails"
          :key="collectionDetail.id">
          <div v-if="showCollections" class="mb-2">
            <div class="collection-header card-header border border-dark p-2">
              <router-link
                :to="'/collection/' + collectionDetail.id"
                title="Collection details">
                <span class="collection-name">{{ collectionDetail.name }}</span>
                <font-awesome-icon
                  class="float-right m-1 text-dark"
                  :icon="['far', 'arrow-alt-circle-right']"/>
              </router-link>
            </div>
            <small>
              <div
                class="
                  pt-2
                  px-2
                  border border-dark border-top-0 border-bottom-0
                  d-flex
                ">
                <collection-selector
                  class="ml-auto"
                  :collectionData="collectionDetail"
                  bookmark></collection-selector>
              </div>
              <view-generator
                class="border border-dark p-2 border-top-0 pt-2"
                :viewmodel="collectionViewmodel(collectionDetail)"/>
            </small>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  getBiobankDetails,
  getCollectionDetails
} from '../../utils/templateMapper'
import ViewGenerator from '../generators/ViewGenerator.vue'
import CollectionSelector from '../buttons/CollectionSelector.vue'

export default {
  name: 'biobank-card',
  components: {
    ViewGenerator,
    CollectionSelector
  },
  props: {
    biobank: {
      type: [Object, String]
    }
  },
  data () {
    return {
      biobankSelected: false,
      showCollections: false
    }
  },
  methods: {
    getCollectionDetails,
    handleCheckAll: function (checked) {
      if (checked === true) {
        this.showCollections = false
      }
    },
    collectionViewmodel (collectiondetails) {
      const attributes = []

      for (const item of this.collectionColumns) {
        if (item.showOnBiobankCard) {
          attributes.push(
            collectiondetails.viewmodel.attributes.find(
              vm => vm.label === item.label
            )
          )
        }
      }
      return { attributes }
    }
  },
  computed: {
    ...mapState([
      'qualityStandardsDictionary',
      'biobankColumns',
      'collectionColumns'
    ]),
    ...mapGetters(['selectedCollections']),
    biobankcardViewmodel () {
      // check if biobank is only the id (lazy loading)
      if (typeof this.biobank === 'string') return {}

      const { viewmodel } = getBiobankDetails(this.biobank)
      const attributes = []

      for (const item of this.biobankColumns) {
        if (item.showOnBiobankCard) {
          attributes.push(
            viewmodel.attributes.find(vm => vm.label === item.label)
          )
        }
      }
      return { attributes }
    },
    biobankInSelection () {
      if (!this.biobank.collections) return false

      console.log('!')

      const biobankCollectionSelection = this.biobank.collections
        .filter(bcf => !bcf.parent_collection)
        .map(bc => ({ label: bc.label || bc.name, value: bc.id }))
      return this.selectedCollections
        .map(sc => sc.value)
        .some(id => biobankCollectionSelection.map(pc => pc.value).includes(id))
    },
    loading () {
      return typeof this.biobank === 'string'
    },
    iconStyle () {
      return {
        transform: `rotate(${this.collapsed ? 0 : 90}deg)`,
        transition: 'transform 0.2s'
      }
    }
  }
}
</script>

<style>
.collections-section,
.biobank-section {
  max-height: 25rem;
  overflow: auto;
}

.collapse-icon {
  position: relative;
  top: 2px;
  font-size: 1.4rem;
}

.collection-items {
  word-break: break-word;
}

.collection-items th {
  width: 25%;
}

.added-to-selection {
  position: absolute;
  z-index: 2;
  top: 9px;
  right: -5px;
  background: white;
  border-radius: 50%;
}

.biobank-name,
.collection-name {
  display: inline-block;
  width: 92%;
}

.biobank-card {
  width: 32.7%;
  margin-bottom: 1rem;
}

.show-collections:focus {
  box-shadow: none;
}

.biobank-card > header,
.collection-header {
  display: flex;
  min-height: 3rem;
  flex-direction: column;
  justify-content: center;
}

.biobank-card-header:hover {
  cursor: pointer;
}

.biobank-icon:hover {
  cursor: pointer;
}

.covid-icon {
  height: 1.5rem;
  width: auto;
}

.icon-alignment {
  position: relative;
  top: 1px;
  left: 2px;
}
</style>
