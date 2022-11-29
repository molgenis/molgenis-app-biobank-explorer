<template>
  <div
    class="collection-spotlight d-flex flex-column"
    :style="'background-color: var(--info);'"
    ref="collectionSpotlight">
    <h1 class="ml-4 mt-4 header-text">
      <span>New collections</span>
    </h1>
    <section class="ml-4 mb-4">
      <template v-for="collection of newCollections">
        <h3 :key="collection.id" class="border-top mr-4 pt-4 mb-2 mt-1 collection-header">
          {{ collection.name }}
        </h3>
        <router-link

          :key="collection.id"
          :to="'/collection/' + collection.id"
          :title="`Go to ${collection.name}`">
          <span class="text-info">See more details</span>
        </router-link>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    newCollections: {
      type: Array,
      required: true
    }
  },
  mounted () {
    /** retrieving the hexcode from the css property */
    const hexCode = getComputedStyle(
      this.$refs.collectionSpotlight
    ).getPropertyValue('--info')
    /** adding an opacity */
    this.$refs.collectionSpotlight.style.backgroundColor = `${hexCode}16`
  }
}
</script>

<style scoped>
.collection-spotlight {
  width: 43%;
  border-radius: 1rem;
}

.collection-header {
  font-size:1.2rem;
  word-break: break-all
}
</style>
