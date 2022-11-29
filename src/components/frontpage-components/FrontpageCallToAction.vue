<template>
  <div class="cta" :style="'background-color: var(--info);'" ref="cta">
    <section class="m-4">
      <slot></slot>
    </section>
    <section class="m-4">
      <a
        :href="ctaUrl"
        class="btn btn-secondary"
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
    const hexCode = getComputedStyle(this.$refs.cta).getPropertyValue('--info')

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
