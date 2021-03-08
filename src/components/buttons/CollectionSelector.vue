
<template>
  <div @click.stop>
    <input
      type="checkbox"
      :id="checkboxIdentifier"
      class="add-to-cart"
      @change.prevent="handleCollectionStatus"
      :checked="checkboxState"
      :value="false"
      hidden
    />
    <label class="add-to-cart-label btn btn-outline-secondary" :for="checkboxIdentifier">
      <span v-if="!iconOnly" class="mr-2">Add to selection</span>
      <span class="fa fa-plus"></span>
    </label>
    <label
      class="btn btn-secondary remove-from-cart-label"
      :for="checkboxIdentifier"
    >
      <span v-if="!iconOnly" class="mr-2">Remove from selection</span>
      <span class="fa fa-minus"></span>
    </label>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CollectionSelector',
  props: {
    collectionData: {
      type: [Object, Array],
      required: true
    },
    iconOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    routerEnabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => {
    return {
      collections: [],
      identifier: ''
    }
  },
  methods: {
    ...mapMutations([
      'AddCollectionsToSelection',
      'RemoveCollectionsFromSelection'
    ]),
    handleCollectionStatus (event) {
      const { checked } = event.target

      const collectionData = { collections: this.collections }
      // when it's required to be on the bookmark, we pass the router
      if (this.routerEnabled) {
        collectionData.router = this.$router
      }

      if (checked) {
        this.AddCollectionsToSelection(collectionData)
      } else {
        this.RemoveCollectionsFromSelection(collectionData)
      }
    }
  },
  computed: {
    ...mapGetters(['selectedCollections']),
    checkboxIdentifier () {
      return this.identifier
    },
    checkboxState () {
      const selectedCollectionIds = this.selectedCollections.map(sc => sc.value)

      return this.collections.map(collection => collection.value)
        .every(id => selectedCollectionIds.includes(id))
    }
  },
  beforeMount () {
    let initialData

    if (Array.isArray(this.collectionData)) {
      initialData = this.collectionData
      this.identifier = `selector-${Math.random().toString().substr(2)}`
    } else {
      initialData = [this.collectionData]
      this.identifier = this.collectionData.id
    }

    this.collections = initialData.map((collection) => ({
      label: collection.label || collection.name,
      value: collection.id
    })
    )
  }
}
</script>

<style scoped>
.btn {
  padding: 0 0.34rem;
}

.btn:hover {
  cursor: pointer;
}

.add-to-cart:checked ~ .add-to-cart-label {
  display: none;
}

.remove-from-cart-label {
  display: none;
}

.add-to-cart:checked ~ .remove-from-cart-label {
  display: inline-block;
}

.remove-from-cart-label:hover {
  cursor: pointer;
  opacity: 0.8;
}
</style>
