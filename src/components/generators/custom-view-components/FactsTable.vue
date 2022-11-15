<template>
  <div class="mt-4" v-if="attribute.value && attribute.value.length">
    <table class="table border w-100">
      <thead>
        <tr>
          <th>Material type</th>
          <th>Samples</th>
          <th>Sex</th>
          <th>Donors</th>
          <th>Disease codes</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fact of attribute.value" >
        <tr :key="fact.id" v-if="hasAFactToShow(fact)">
          <th scope="row" class="pr-1 align-top text-nowrap">
            {{ fact.sample_type.label }}
          </th>
          <td>{{ fact.number_of_samples || '-' }}</td>
          <td>{{ fact.sex || '-' }}</td>
          <td>{{ fact.number_of_donors || '-' }}</td>
          <td v-if="fact.disease && fact.disease.length">
            <div
              v-for="disease in fact.disease"
              :key="disease.id"
              class="badge">
              {{ disease.id }}
            </div>
          </td>
          <td v-else>
            -
          </td>
        </tr>
        </template>
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
  methods: {
    hasAFactToShow (fact) {
      const hasSamples = fact.number_of_samples && parseInt(fact.number_of_samples) !== 0
      const hasDonors = fact.number_of_donors && parseInt(fact.number_of_samples) !== 0
      const facts = [hasSamples, hasDonors, fact.sex]

      /** return true, if any of the facts is filled it. */
      return facts.some(fact => fact)
    }
  }
}
</script>
