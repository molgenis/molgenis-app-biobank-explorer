<template>
  <div class="cta d-flex flex-column" :style="'background-color: var(--info);'" ref="cta">
    <section class="m-4">
      <slot></slot>
    </section>
    <section class="m-4 mt-auto">
      <a
        :href="ctaUrl"
        class="btn btn-secondary "
        role="button"
        aria-pressed="true">{{ ctaText }}</a>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    ctaUrl: {
      type: String,
      required: true
    },
    ctaText: {
      type: String,
      required: true
    }
  },
  mounted () {
    /** retrieving the hexcode from the css property */
    const hexCode = getComputedStyle(this.$refs.cta).getPropertyValue('--info')
    /** adding an opacity */
    this.$refs.cta.style.backgroundColor = `${hexCode}50`
  }
}
</script>

<style scoped>
.cta {
  width: 30%;
  position: relative;
  border-radius: 1rem;
  min-height: 10rem;
}
</style>
