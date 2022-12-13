<template>
  <div class="mt-4" v-if="attribute.value && attribute.value.length">
    <table class="table border w-100">
      <thead>
        <tr>
          <th @click="sort('sample_type.label')">Material type</th>
          <th @click="sort('number_of_samples')">Samples</th>
          <th @click="sort('sex.CollectionSex')">Sex</th>
          <th @click="sort('number_of_donors')">Donors</th>
          <th @click="sort('disease.id')">Disease codes</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fact of facts">
          <tr :key="fact.id" v-if="hasAFactToShow(fact)">
            <th scope="row" class="pr-1 align-top text-nowrap">
              {{ fact.sample_type.label }}
            </th>
            <td>{{ fact.number_of_samples || "-" }}</td>
            <td>{{ fact.sex ? fact.sex.CollectionSex : "-" }}</td>
            <td>{{ fact.number_of_donors || "-" }}</td>
            <td v-if="fact.disease && fact.disease.length">
              <div
                v-for="disease in fact.disease"
                :key="disease.id"
                class="badge">
                {{ disease.id }}
              </div>
            </td>
            <td v-else>-</td>
          </tr>
        </template>
        <tr>
          <th>Totals:</th>
          <td>
            {{
              facts
                .map((fact) => parseInt(fact.number_of_samples))
                .reduce((a, b) => a + b)
            }}
          </td>
          <td></td>
          <td>
            {{
              facts
                .map((fact) => parseInt(fact.number_of_donors))
                .reduce((a, b) => a + b)
            }}
          </td>
          <td></td>
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
  data () {
    return {
      facts: [],
      sortColumn: '',
      sortAsc: false
    }
  },
  methods: {
    hasAFactToShow (fact) {
      const hasSamples =
        fact.number_of_samples && parseInt(fact.number_of_samples) !== 0
      const hasDonors =
        fact.number_of_donors && parseInt(fact.number_of_samples) !== 0
      const facts = [hasSamples, hasDonors, fact.sex]

      /** return true, if any of the facts is filled it. */
      return facts.some(fact => fact)
    },
    sort (column) {
      /** user clicked again */
      if (this.sortColumn === column) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortColumn = column
        this.sortAsc = true
      }

      const trail = column.split('.')

      this.facts.sort((factA, factB) => {
        let factValueA, factValueB

        if (trail.length === 1) {
          factValueA = isNaN(factA[trail[0]])
            ? factA[trail[0]]
            : parseInt(factA[trail[0]])

          factValueB = isNaN(factB[trail[0]])
            ? factB[trail[0]]
            : parseInt(factB[trail[0]])
        } else {
          factValueA = isNaN(factA[trail[0]][trail[1]])
            ? factA[trail[0]][trail[1]]
            : parseInt(factA[trail[0]][trail[1]])

          factValueB = isNaN(factB[trail[0]][trail[1]])
            ? factB[trail[0]][trail[1]]
            : parseInt(factB[trail[0]][trail[1]])
        }

        if (factValueA > factValueB) {
          return this.sortAsc ? 1 : -1
        } else if (factValueA < factValueB) {
          return this.sortAsc ? -1 : 1
        }

        return 0
      })
    }
  },
  mounted () {
    this.facts = Object.assign([], this.attribute.value)
  }
}
</script>

<style scoped>
tr th:not(:first-child),
tr td:not(:first-child) {
  text-align: right;
}

thead tr th:hover {
  cursor: pointer;
}
</style>
