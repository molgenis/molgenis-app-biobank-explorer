<template>
  <div
    class="banner d-flex flex-column justify-content-center align-items-center">
    <h1 class="text-white mb-5 mt-5">
      <span>{{ headerText }}</span>
    </h1>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.banner {
  /* https://pixabay.com/illustrations/bacteria-illness-virus-infection-163711/  */
  background: url("../../../public/bacteria.jpg");
  background-size: cover;
  height: 30rem;
  width: 71%;
  border-radius: 1rem;
}

 ::v-deep ~ *  {
  width: 70%;
}
</style>
