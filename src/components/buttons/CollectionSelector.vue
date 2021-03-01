
<template>
  <div>
    <input
      type="checkbox"
      :id="collection.id"
      class="add-to-cart"
      @change="handleCollectionStatus"
      :checked="collectionSelected(collection.id)"
      :value="{
        label: collection.label || collection.name,
        value: collection.id,
      }"
      hidden
    />
    <label class="add-to-cart-label btn btn-info" :for="collection.id">
      <span v-if="!iconOnly" class="mr-2">Add to selection</span>
      <span class="fa fa-plus"></span>
    </label>
    <label
      class="btn btn-outline-info remove-from-cart-label"
      :for="collection.id"
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
  methods: {
    ...mapMutations([
      'AddCollectionToSelection',
      'RemoveCollectionFromSelection'
    ]),
    collectionSelected (collectionId) {
      return (
        this.selectedCollections.map((sc) => sc.value).indexOf(collectionId) >=
        0
      )
    },
    handleCollectionStatus (event) {
      const { checked, _value } = event.target

      const collectionData = { collection: _value }

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
    ...mapGetters(['selectedCollections'])
  }
}
</script>

<style scoped>
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
