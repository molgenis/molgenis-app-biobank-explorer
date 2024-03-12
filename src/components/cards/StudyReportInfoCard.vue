<template>
  <div class="col-md-4">
    <div class="card">
      <div class="card-body">
        <div class="card-text">
          <template v-if="info.also_known.length > 0">
            <h5 class="mt-4">External link</h5>
            <ul class="right-content-list" v-for="also_known in info.also_known" :key="`${also_known.id}`">
              <li>
                <div>
                  <a :href="`${also_known.url}`" target="_blank">{{ also_known.system }}</a>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyReportInfoCard',
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.right-content-list {
  list-style-type: none;
  margin-left: -2.5rem;
}
.right-content-list:not(:last-child) {
  margin-bottom: 1.5rem;
}

.right-content-list li {
  margin-bottom: 0.5rem;
}
</style>
