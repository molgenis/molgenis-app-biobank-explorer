<template>
  <div class="background-image d-flex flex-column text-white pl-4">
    <h1 class="mt-4 header-text">
      <span>{{ headerText }}</span>
      <p>{{ biobankName }}</p>
    </h1>
    <div v-if="bodyHtml" v-html="bodyHtml"></div>
    <section class="mt-auto mb-4">
      <router-link
        :to="'/biobank/' + biobankId"
        :title="`Go to ${biobankName}`"
        class="btn btn-primary">
        <span>{{ buttonText }}</span>
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      required: true
    },
    biobankName: {
      type: String,
      required: true
    },
    biobankId: {
      type: String,
      required: true
    },
    bodyHtml: {
      type: String,
      required: false
    },
    buttonText: {
      type: String,
      required: true
    }
  }

}
</script>

<style scoped>
.header-text {
  font-size: 1.6rem;
}

.header-text p {
  font-size: 2.5rem;
  font-weight: bold;
}

.background-image {
  /* https://www.pexels.com/photo/close-up-of-microscope-256262/ */
  background: url("../../../public/microscope.jpg");
  background-size: cover;
  height: 30rem;
  width: 50%;
  border-radius: 1rem;
}
</style>
