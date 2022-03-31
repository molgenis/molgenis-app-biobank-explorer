<template>
  <div
    :class="[
      { 'border-secondary': biobankInSelection },
      'card border-dark biobank-card',
    ]">
    <div v-if="loading" class="text-center p-5">
      <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
    </div>
    <div v-else>
      <header class="border-bottom border-dark card-header p-1">
        <h5 class="pt-1 pl-2 pr-1 mt-1">
          <router-link :to="'/biobank/' + biobank.id" title="Biobank details">
            <span class="biobank-name">{{ biobank.name }}</span>
            <font-awesome-icon
              class="float-right m-1 text-dark"
              :icon="['far', 'arrow-alt-circle-right']"/>
          </router-link>
        </h5>
      </header>

      <ul class="nav nav-tabs mt-1" v-if="biobank.collections.length">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{
              active: !showCollections,
              'border bg-white': showCollections,
            }"
            @click.prevent="showCollections = false">
            Details
          </button>
        </li>
        <li class="nav-item ml-1">
          <button
            class="nav-link"
            :class="{
              active: showCollections,
              'border bg-white': !showCollections,
            }"
            @click.prevent="showCollections = true">
            Collections
          </button>
        </li>
      </ul>
      <section v-show="!showCollections" class="p-2 pt-1 biobank-section">
        <small>
          <view-generator :viewmodel="biobankcardViewmodel" />
        </small>
      </section>
      <section class="card-body collections-section pt-0">
        <div
          class="collection-items"
          v-for="collectionDetail of biobank.collectionDetails"
          :key="collectionDetail.id">
          <div v-show="showCollections" class="mb-2">
            <div class="my-2 collection-header">
              <router-link
                :to="'/collection/' + collectionDetail.id"
                title="Collection details">
                <span class="collection-name">{{ collectionDetail.name }}</span>
                <font-awesome-icon
                  class="float-right m-1 text-dark"
                  :icon="['far', 'arrow-alt-circle-right']"/>
              </router-link>
            </div>
            <hr class="mt-0" />
            <small>
              <view-generator :viewmodel="collectionDetail.viewmodel" />
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

export default {
  name: 'biobank-card',
  components: {
    ViewGenerator
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
    }
  },
  computed: {
    ...mapState(['qualityStandardsDictionary', 'biobankColumns']),
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
