<template>
  <div class="input-group mb-3 searchbar">
    <input
      type="text"
      class="form-control border border-dark border-right-0"
      :placeholder="searchPlaceholder"
      :aria-label="ariaLabel"/>
    <div class="input-group-append">
      <button
        class="btn btn-primary search-button border border-dark border-left-0"
        type="button">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      required: true
    },
    searchPlaceholder: {
      type: String,
      required: true
    },
    ariaLabel: {
      type: String,
      required: true
    }
  }
}
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
