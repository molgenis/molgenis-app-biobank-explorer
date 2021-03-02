
<template>
  <div @click.stop>
    <input
      type="checkbox"
      :id="identifier"
      class="add-to-cart"
      @change.prevent="handleCollectionStatus"
      :checked="checkboxState"
      :value="false"
      hidden
    />
    <label class="add-to-cart-label btn btn-secondary" :for="identifier">
      <span v-if="!iconOnly" class="mr-2">Add to selection</span>
      <span class="fa fa-plus"></span>
    </label>
    <label
      class="btn btn-outline-secondary remove-from-cart-label"
      :for="identifier"
    >
      <span v-if="!iconOnly" class="mr-2">Remove from selection</span>
      <span class="fa fa-times"></span>
    </label>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CollectionSelector',
  props: {
    collection: {
      type: Object,
      required: false
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
    },
    // We must override the checkbox id if we add an array
    checkboxId: {
      type: String,
      required: false
    },
    collections: {
      type: Array,
      required: false
    }
  },
  methods: {
    ...mapMutations([
      'AddCollectionToSelection',
      'RemoveCollectionFromSelection'
    ]),
    handleCollectionStatus (event) {
      const { checked } = event.target

      const collectionData = { collection: this.checkboxValue }
      // when it's required to be on the bookmark, we pass the router
      if (this.routerEnabled) {
        collectionData.router = this.$router
      }

      if (checked) {
        this.AddCollectionToSelection(collectionData)
      } else {
        this.RemoveCollectionFromSelection(collectionData)
      }
    }
  },
  computed: {
    ...mapGetters(['selectedCollections']),
    identifier () {
      return this.checkboxId || this.collection.id
    },
    checkboxState () {
      const selectedCollectionIds = this.selectedCollections.map(sc => sc.value)

      if (this.collection) {
        return selectedCollectionIds.includes(this.collection.id)
      } else {
        return this.collections.map(collection => collection.value)
          .every(id => selectedCollectionIds.includes(id))
      }
    },
    checkboxValue () {
      if (this.collection) {
        // We need to do this, because the button is generated in a loop of collctions
        return {
          label: this.collection.label || this.collection.name,
          value: this.collection.id
        }
      } else {
        return this.collections.map((collection) => ({
          label: collection.label || collection.name,
          value: collection.id
        }))
      }
    }
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
