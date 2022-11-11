<template>
  <div class="mt-4" v-if="attribute.value && attribute.value.length">
    <h3>Facts sheet</h3>
    <table class="table border w-100">
      <thead>
        <tr>
          <th>Material type:</th>
          <th>Samples:</th>
          <th>Donors:</th>
          <th>Disease codes:</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fact of attribute.value" :key="fact.id">
          <th scope="row" class="pr-1 align-top text-nowrap">
            {{ fact.sample_type.label }}
          </th>
          <td>{{ fact.number_of_samples }}</td>
          <td>{{ fact.number_of_donors }}</td>
          <td>
            <div
              v-for="disease in fact.disease"
              :key="disease.id"
              class="badge">
              {{ disease.id }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    attribute: {
      type: Object
    }
  },
  mounted () {
    console.log(this.attribute)
  }
}
</script>
