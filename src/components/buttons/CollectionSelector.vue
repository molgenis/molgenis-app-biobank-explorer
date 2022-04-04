
<template>
  <div @click.stop>
    <input
      type="checkbox"
      :id="checkboxIdentifier"
      class="add-to-cart"
      @change.prevent="handleCollectionStatus"
      :checked="isChecked"
      :value="false"
      hidden/>
    <label v-if="!iconOnly" class="add-to-cart-label btn btn-outline-secondary px-2" :for="checkboxIdentifier">
      <span>Add</span>
    </label>
    <label v-else class="add-to-cart-label btn" :for="checkboxIdentifier">
      <font-awesome-icon
        :style="checkboxFaStyle"
        :icon="['far', 'square']"
        size="lg"></font-awesome-icon>
    </label>
    <label
      v-if="!iconOnly"
      class="btn remove-from-cart-label btn-outline-danger px-2"
      :for="checkboxIdentifier">
      <span>Remove</span>
    </label>
    <label
      v-else
      class="btn remove-from-cart-label"
      :for="checkboxIdentifier">
      <font-awesome-icon
        :style="checkboxFaStyle"
        :icon="['fas', 'check-square']"
        size="lg"></font-awesome-icon>
    </label>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
    bookmark: {
      type: Boolean,
      required: false,
      default: false
    },
    checkboxFaStyle: {
      type: Object,
      required: false,
      default: function () {
        return {
          color: 'var(--secondary)'
        }
      }
    }
  },
  data: () => {
    return {
      isChecked: false,
      collections: [],
      identifier: ''
    }
  },
  methods: {
    ...mapActions([
      'AddCollectionsToSelection'
    ]),
    ...mapMutations([
      'RemoveCollectionsFromSelection'
    ]),
    handleCollectionStatus (event) {
      const { checked } = event.target

      const collectionData = { collections: this.collections, bookmark: this.bookmark }

      if (checked) {
        this.isChecked = true
        this.AddCollectionsToSelection(collectionData)
      } else {
        this.isChecked = false
        this.RemoveCollectionsFromSelection(collectionData)
      }
    }
  },
  computed: {
    ...mapGetters(['selectedCollections']),
    checkboxIdentifier () {
      return this.identifier
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
    const selectedCollectionIds = this.selectedCollections.map(sc => sc.value)
    this.isChecked = this.collections.map(collection => collection.value)
      .every(id => selectedCollectionIds.includes(id))
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
