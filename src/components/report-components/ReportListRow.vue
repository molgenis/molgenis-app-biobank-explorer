<template>
  <tr v-if="data.value.length > 0">
    <th scope="row" class="pr-1"><slot></slot></th>
    <td>
      <template v-if="dataContainsUri">
        <a :href="obj.uri"
        target="_blank"
          v-for="(obj, index) in data.value"
          class="m-1 badge"
          :key="index + obj.label"
          :class="'badge-' + (data.badgeColor ? data.badgeColor : 'success')"
          >{{ obj.label }}
          <span class="ml-1 fa fa-external-link" aria-hidden="true"></span>
        </a>
      </template>
      <template v-else>
        <span
          v-for="(val, index) in data.value"
          class="m-1 badge"
          :key="index"
          :class="'badge-' + (data.badgeColor ? data.badgeColor : 'success')"
          >{{ val }}
        </span>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ReportListRow',
  props: {
    data: Object
  },
  computed: {
    dataContainsUri () {
      return typeof this.data.value[0] === 'object'
    }
  }
}
</script>

<style scoped>
.badge {
  transition: transform 0.1s;
  box-shadow: 0 0 0 1px white;
}
.badge:hover {
  transform: scale(1.4);
}
.fa-external-link {
  top: 1px;
  position: relative;
}

.fa-external-link:hover {
  cursor: pointer;
}
</style>
