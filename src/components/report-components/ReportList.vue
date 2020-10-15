<template>
  <tr v-if="data.value.length > 0">
    <th scope="row" class="pr-1"><slot></slot></th>
    <td>
      <span
        v-for="(val, index) in data.value"
        class="m-1 badge"
        :key="index"
        :class="'badge-' + (data.badgeColor ? data.badgeColor : 'success')"
      >{{ val }}</span>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ReportList',
  props: {
    data: Object
  }
}
</script>

<style scoped>
  .badge{
    transition: transform 0.1s;
    box-shadow: 0 0 0 1px white;
  }
  .badge:hover{
    transform: scale(1.4);
  }
</style>
