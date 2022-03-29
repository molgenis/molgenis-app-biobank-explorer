<template>
  <div
    :class="[
      { 'border-secondary': biobankInSelection },
      'card border-dark biobank-card',
    ]">
    <header class="border-bottom border-dark card-header p-0">
      <h5 class="pt-1 pl-2 pr-1 mt-1">
        <router-link :to="'/biobank/' + biobank.id" title="Biobank details">
          <span id="biobank-name">{{ biobank.name }}</span>
          <font-awesome-icon
            class="float-right m-1 text-dark"
            :icon="['far', 'arrow-alt-circle-right']"/>
        </router-link>
      </h5>
    </header>
    <section class="px-2 pt-4">
      <small>
        <view-generator :viewmodel="biobankcardViewmodel" />
      </small>
    </section>
  </div>
</template>

<script>
// import CollectionSelector from '../buttons/CollectionSelector'
// import CollectionsTable from '../tables/CollectionsTable.vue'
// import quality from '../generators/view-components/quality.vue' /* soon will turn into a generated view */
import { mapGetters, mapState } from 'vuex'
import { sortCollectionsByName } from '../../utils/sorting'
import { getBiobankDetails } from '../../utils/templateMapper'
import ViewGenerator from '../generators/ViewGenerator.vue'

export default {
  name: 'biobank-card',
  components: {
    // CollectionsTable,
    // quality
    // CollectionSelector,
    ViewGenerator
  },
  props: {
    biobank: {
      type: [Object, String]
    },
    initCollapsed: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      biobankSelected: false,
      collapsed: this.initCollapsed
    }
  },
  methods: {
    handleCheckAll: function (checked) {
      if (checked === true) {
        this.collapsed = false
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

      // override for badges for homescreen card, else it will be a christmas tree.
      // attributes.forEach(attribute => {
      //   if (attribute.badgeColor) {
      //     attribute.badgeColor = 'light'
      //   }
      // })

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
    sortedCollections () {
      return sortCollectionsByName(this.biobank.collections)
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
.table-card {
  padding: 0.1rem;
}

.added-to-selection {
  position: absolute;
  z-index: 2;
  top: 9px;
  right: -5px;
  background: white;
  border-radius: 50%;
}

#biobank-name {
  display: inline-block;
  width: 92%;
}

.biobank-card {
  width: 32.7%;
  margin-bottom: 1em;
}

.biobank-card > header {
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
