<template>
  <div :class="'mt-3 ml-'+(level)">
    <b>
      <router-link :to='"/collection/"+collection.id'>{{collection.name}}</router-link>
    </b>

    <tr v-if="Size">
      <th scope="row" class="pr-1" v-if="Size">Size:</th>
      <td>
          <span
            v-for="(val, index) in Size.value"
            class="m-1 badge"
            :key="index"
            :class="'badge-' + (Size.badgeColor ? Size.badgeColor : 'success')"
          >{{ val }}</span>
      </td>
    </tr>
    <tr v-if="Materials">
      <th scope="row" class="pr-1" v-if="Materials">Materials:</th>
      <td>
          <span
            v-for="(val, index) in Materials.value"
            class="m-1 badge"
            :key="index"
            :class="'badge-' + (Materials.badgeColor ? Materials.badgeColor : 'success')"
          >{{ val }}</span>
      </td>
    </tr>
    <tr v-if="Data">
      <th scope="row" class="pr-1" v-if="Data">Data:</th>
      <td>
          <span
            v-for="(val, index) in Data.value"
            class="m-1 badge"
            :key="index"
            :class="'badge-' + (Data.badgeColor ? Data.badgeColor : 'success')"
          >{{ val }}</span>
      </td>
    </tr>

    <div v-if="collection.subCollections && collection.subCollections.length > 0" class="m-3">
      <b>Sub collections</b>
      <report-sub-collection
        v-for="subCollection in collection.subCollections"
        :collection="subCollection"
        :key="subCollection.id"
        :level="level + 1"
      ></report-sub-collection>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportSubCollection',
  props: {
    level: Number,
    collection: {
      description: String,
      parentCollection: Object,
      subCollections: Array,
      name: String,
      id: String,
      content: {
        [String]: {
          value: String,
          type:
            'string' |
            'email' |
            'url' |
            'bool' |
            'list' |
            'phone' |
            'report' |
            'string-with-key',
          batchColor: {
            type:
              'success' |
              'warning' |
              'info' |
              'secondary' |
              'danger' |
              'light' |
              'dark',
            required: false
          }
        }
      }
    }
  },
  computed: {
    Size () {
      return this.collection.content.Size
    },
    Materials () {
      return this.collection.content.Materials
    },
    Data () {
      return this.collection.content.Data
    }
  }
}
</script>
