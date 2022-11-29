<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Find a biobank or collection"
      aria-label="Searchbox for finding a biobank or collection"/>
    <div class="input-group-append">
      <button class="btn btn-primary search-button" type="button">Search</button>
    </div>
  </div>
</template>

<script>
export default {}
</script>
<style scoped>
.search-button {
    min-width:12rem;
}
</style>
