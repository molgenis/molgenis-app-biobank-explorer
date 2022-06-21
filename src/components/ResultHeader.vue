<template>
  <small class="d-inline">
    <table class="text-right">
      <thead>
        <tr>
          <th colspan="2">Search results</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="pr-1">Organisations:</td>
          <td>{{ foundBiobanks }}</td>
        </tr>
        <tr>
          <td class="pr-1">Collection(s):</td>
          <td>{{ parentCollections.length }}</td>
        </tr>
        <tr v-if="subcollections.length > 0">
          <td class="pr-1">Subcollection(s):</td>
          <td>{{ subcollections.length }}</td>
        </tr>
      </tbody>
    </table>
  </small>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['foundBiobanks', 'subcollections', 'parentCollections'])
  }
}
</script>
