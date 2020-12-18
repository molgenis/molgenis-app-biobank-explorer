
<template>
  <div>
    <input
      type="checkbox"
      :id="collection.id"
      class="add-to-cart"
      @change="handleCollectionStatus"
      :checked="collectionSelected(collection.id)"
      :value="{ label: collection.label || collection.name, value: collection.id }"
      hidden
    />
    <label class="add-to-cart-label btn btn-success" :for="collection.id">Add to selection<span class="ml-2 fa fa-plus"></span></label>
    <label class="remove-from-cart-label btn btn-danger" :for="collection.id">
      Remove from selection<span class="ml-2 fa fa-times"> </span
    ></label>
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
    }
  },
  methods: {
    ...mapMutations(['AddCollectionToSelection', 'RemoveCollectionFromSelection']),
    collectionSelected (collectionId) {
      return this.selectedCollections.map(sc => sc.value).indexOf(collectionId) >= 0
    },
    handleCollectionStatus (event) {
      const checkbox = event.target
      if (checkbox.checked === true) {
        this.AddCollectionToSelection({ collection: checkbox._value })
      } else {
        this.RemoveCollectionFromSelection({ collection: checkbox._value })
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
</style>
