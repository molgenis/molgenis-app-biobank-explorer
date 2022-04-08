<template>
  <!-- template -->
  <article
    :class="[
      {
        'border-secondary': biobankInSelection,
        'border-light': !biobankInSelection,
        'back-side': showCollections,
      },
      'biobank-card flip',
    ]">
    <div tabindex="0">
      <section>
        <div class="front">
          <div v-if="loading" class="text-center p-5">
            <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
          </div>
          <div v-else>
            <header class="border-0 card-header p-1">
              <h5 class="pt-1 pl-2 pr-1 mt-1">
                <router-link
                  :to="'/biobank/' + biobank.id"
                  title="Biobank details">
                  <span class="biobank-name">{{ biobank.name }}</span>
                  <font-awesome-icon
                    class="float-right m-1 text-dark"
                    :icon="['far', 'arrow-alt-circle-right']"/>
                </router-link>
              </h5>
            </header>

            <div class="d-flex mt-2" v-if="biobank.collections.length">
              <button
                class="btn ml-2"
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
                class="text-right ml-auto mr-2 mt-1 align-self-center"
                v-if="biobank.collections.length > 0"
                :collectionData="biobank.collections"
                bookmark></collection-selector>
            </div>
            <div v-if="!showCollections" class="p-2 pt-1 biobank-section">
              <small>
                <view-generator :viewmodel="biobankcardViewmodel" />
              </small>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="back">
          <div class="card-body collections-section pt-0">
            <div
              class="collection-items mt-4"
              v-for="collectionDetail of biobank.collectionDetails"
              :key="collectionDetail.id">
              <div class="mt-2">
                <button
                  class="btn"
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
                  class="text-right ml-auto mr-2 mt-1 align-self-center"
                  v-if="biobank.collections.length > 0"
                  :collectionData="biobank.collections"
                  bookmark></collection-selector>
              </div>

              <div v-if="showCollections" class="mb-2">
                <div class="collection-header card-header border p-2">
                  <router-link
                    :to="'/collection/' + collectionDetail.id"
                    title="Collection details">
                    <span class="collection-name">{{
                      collectionDetail.name
                    }}</span>
                    <font-awesome-icon
                      class="float-right m-1 text-dark"
                      :icon="['far', 'arrow-alt-circle-right']"/>
                  </router-link>
                </div>
                <small>
                  <div
                    class="pt-2 px-2 border border-top-0 border-bottom-0 d-flex">
                    <collection-selector
                      class="ml-auto"
                      :collectionData="collectionDetail"
                      bookmark></collection-selector>
                  </div>
                  <view-generator
                    class="border p-2 border-top-0 pt-2"
                    :viewmodel="collectionViewmodel(collectionDetail)"/>
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </article>
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
    ...mapState(['biobankColumns', 'collectionColumns']),
    ...mapGetters(['selectedCollections']),
    biobankcardViewmodel () {
      // check if biobank is still loading
      if (this.loading) return {}

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

.collection-items {
  word-break: break-word;
}

.collection-items th {
  width: 25%;
}

.biobank-name,
.collection-name {
  display: inline-block;
  width: 92%;
}

.biobank-card {
  width: 25rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
}

.biobank-card > header,
.collection-header {
  display: flex;
  min-height: 3rem;
  flex-direction: column;
  justify-content: center;
}

/* TODO put in theme */
.card-header {
  background-color: #efefef;
}

/** Flip card */
article {
  padding: 1.5rem;
}

article footer {
  padding: 1.5rem 0 0 0;
}
article.flip {
  padding: 0;
  position: relative;
  height: 30rem;
  perspective: 1000px;
}

article.flip div[tabindex="0"] {
  box-shadow: 0 6.4px 14.4px 0 rgba(0, 0, 0, 0.132),
    0 1.2px 3.6px 0 rgba(0, 0, 0, 0.108);
}
article.flip [tabindex="0"] section {
  background-color: #fff;
  border: 0.1px solid #fff;
}

article.flip.back-side > [tabindex="0"] {
  transform: rotateY(180deg);
}
article.flip [tabindex="0"] {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

article.flip [tabindex="0"] section {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  /* Safari */
  backface-visibility: hidden;
  box-sizing: border-box;
}

article.flip [tabindex="0"] section:last-child {
  transform: rotateY(180deg);
}

/** ~~~ */
</style>
