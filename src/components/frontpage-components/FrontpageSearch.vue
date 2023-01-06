<template>
  <div class="input-group mb-3 searchbar">
    <input
      type="text"
      class="form-control border border-dark border-right-0"
      placeholder="Find a biobank or collection"
      aria-label="Searchbox for finding a biobank or collection"/>
    <div class="input-group-append">
      <button
        class="btn btn-primary search-button border border-dark border-left-0"
        type="button">
        Search
      </button>
    </div>
  </div>
</template>

<script>
export default {}
</script>
<style scoped>
.search-button {
  min-width: 12rem;
}

.searchbar {
  height: 3rem;
}

.searchbar > input {
  height: 3rem;
  font-size: 1.2rem;
}

.input-group > .custom-select:focus::placeholder,
.input-group > .form-control:focus::placeholder {
  color: red;
  opacity: 0 !important;
}
</style>
