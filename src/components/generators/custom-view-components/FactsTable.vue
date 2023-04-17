<template>
  <div class="mt-4" v-if="attribute.value && attribute.value.length">
    <table class="table border w-100">
      <thead>
        <tr class="facts-header bg-secondary text-white">
          <th @click="sort('sample_type.label')">Material type</th>
          <th @click="sort('sex.CollectionSex')">Sex</th>
          <th @click="sort('age.CollectionAgeRange')">Age range</th>
          <th @click="sort('disease.label')">Disease codes</th>
          <th @click="sort('number_of_donors')">Donors</th>
          <th @click="sort('number_of_samples')">Samples</th>
        </tr>
        <tr class="filter-bar">
          <th>
            <select @change="filter('sample_type.label', $event)" class="w-100">
              <option value="all">All</option>
              <option
                v-for="material of materialtypeOptions"
                :key="material"
                :value="material || 'Unknown'">
                {{ material || "Unknown" }}
              </option>
            </select>
          </th>
          <th>
            <select
              @change="filter('sex.CollectionSex', $event)"
              class="text-right">
              <option value="all">All</option>
              <option v-for="sex of sexOptions" :key="sex" :value="sex">
                {{ sex || "Unknown" }}
              </option>
            </select>
          </th>

          <th>
            <select
              @change="filter('age.CollectionAgeRange', $event)"
              class="text-right">
              <option value="all">All</option>
              <option
                v-for="ageRange of ageRangeOptions"
                :key="ageRange"
                :value="ageRange || 'Unknown'">
                {{ ageRange || "Unknown" }}
              </option>
            </select>
          </th>
          <th>
            <select
              @change="filter('disease.label', $event)"
              class="text-right">
              <option value="all">All</option>
              <option
                v-for="disease of diseaseOptions"
                :key="disease"
                :value="disease">
                {{ disease || "Unknown" }}
              </option>
              <option value="collapse">Grouped together</option>
            </select>
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="collapsedFacts.length === 0">
        <template v-for="fact of factsTable">
          <tr :key="fact.id" v-if="hasAFactToShow(fact)">
            <th scope="row" class="pr-1 align-top text-nowrap">
              {{ fact.sample_type ? fact.sample_type.label : "Unknown" }}
            </th>
            <td>{{ fact.sex ? fact.sex.CollectionSex : "Unknown" }}</td>
            <td>{{ fact.age ? fact.age.CollectionAgeRange : "Unknown" }}</td>
            <td v-if="fact.disease" class="text-nowrap">
              <span :title="fact.disease.id">
                {{ fact.disease.label }}
              </span>
            </td>
            <td v-else>Unknown</td>
            <td>{{ fact.number_of_donors || "Unknown" }}</td>
            <td>{{ fact.number_of_samples || "Unknown" }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    {{ this.collapsedFacts }}
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
      sortAsc: false,
      filters: [],
      collapseColumns: [],
      collapsedFacts: [],
      collapsableColumns: [
        'sample_type.label',
        'sex.CollectionSex',
        'age.CollectionAgeRange',
        'disease.label'
      ]
    }
  },
  computed: {
    materialtypeOptions () {
      return [
        ...new Set(this.attribute.value.map((attr) => attr.sample_type?.label))
      ]
    },
    sexOptions () {
      return [
        ...new Set(this.attribute.value.map((attr) => attr.sex?.CollectionSex))
      ]
    },
    ageRangeOptions () {
      return [
        ...new Set(
          this.attribute.value.map((attr) => attr.age?.CollectionAgeRange)
        )
      ]
    },
    diseaseOptions () {
      return [
        ...new Set(this.attribute.value.map((attr) => attr.disease?.label))
      ]
    },
    factsTable () {
      if (this.filters.length === 0) return this.facts
      const filteredFacts = []

      const lastFilterIndex = this.filters.length - 1

      for (const fact of this.facts) {
        for (const [index, filter] of this.filters.entries()) {
          const propertyValue = this.getPropertyValue(fact, filter.column)
          /** it did not match all filters, so goodbye. */
          if (!propertyValue) {
            filteredFacts.push(fact)
          } else if (propertyValue !== filter.value) {
            break
          } else if (index === lastFilterIndex) {
            filteredFacts.push(fact)
          }
        }
      }

      return filteredFacts
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
      return facts.some((fact) => fact)
    },
    filter (column, event) {
      const indexToRemove = this.filters.findIndex(
        (fa) => fa.column === column
      )

      if (indexToRemove > -1) {
        this.filters.splice(indexToRemove, 1)
      }

      if (event.target.value === 'collapse') {
        if (this.collapseColumns.includes(column)) return
        else this.collapseColumns.push(column)

        this.collapseRows()
        return
      } else {
        const wasCollapsedIndex = this.collapseColumns.indexOf(column)

        if (wasCollapsedIndex >= 0) {
          this.collapseColumns.splice(wasCollapsedIndex, 1)
          this.collapseRows()
        }
      }

      if (event.target.value !== 'all') {
        this.filters.push({ column, value: event.target.value })
      }
    },
    sort (column) {
      /** user clicked again */
      if (this.sortColumn === column) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortColumn = column
        this.sortAsc = true
      }

      this.facts.sort((factA, factB) => {
        const factAProperty = this.getPropertyValue(factA, column)
        const factBProperty = this.getPropertyValue(factB, column)

        const factValueA = isNaN(factAProperty)
          ? factAProperty
          : parseInt(factAProperty)

        const factValueB = isNaN(factBProperty)
          ? factBProperty
          : parseInt(factBProperty)

        if (factValueA > factValueB) {
          return this.sortAsc ? 1 : -1
        } else if (factValueA < factValueB) {
          return this.sortAsc ? -1 : 1
        }

        return 0
      })
    },
    getPropertyValue (object, propertyString) {
      const trail = propertyString.split('.')
      const trailLength = trail.length

      // could be recursive, but out of scope for now
      switch (trailLength) {
        case 1: {
          return object[trail[0]]
        }
        case 2: {
          if (!object[trail[0]]) return 'Unknown'

          return object[trail[0]][trail[1]]
        }
        case 3: {
          if (!object[trail[0]] || !object[trail[0]][trail[1]]) {
            return 'Unknown'
          }

          return object[trail[0]][trail[1]][trail[2]]
        }
      }
    },
    addValueToProperty (object, propertyString, value) {
      const trail = propertyString.split('.')
      const trailLength = trail.length

      // could be recursive, but out of scope for now
      switch (trailLength) {
        case 1: {
          if (Array.isArray(object[trail[0]])) {
            object[trail[0]].push(value)
          } else {
            object[trail[0]] = [object[trail[0]], value]
          }
          break
        }
        case 2: {
          if (!object[trail[0]]) {
            object[trail[0]] = {}
          }

          if (
            object[trail[0]][trail[1]] &&
            Array.isArray(object[trail[0]][trail[1]])
          ) {
            object[trail[0]][trail[1]].push(value)
          } else {
            object[trail[0]][trail[1]] = [object[trail[0]][trail[1]], value]
          }
          break
        }
        case 3: {
          if (!object[trail[0]]) {
            object[trail[0]] = {}
          }
          if (!object[trail[0]][trail[1]]) {
            object[trail[0]][trail[1]] = {}
          }
          if (!object[trail[0]][trail[1]][trail[2]]) {
            object[trail[0]][trail[1]][trail[2]] = {}
          }

          if (Array.isArray(object[trail[0]][trail[1]])) {
            object[trail[0]][trail[1]][trail[2]].push(value)
          } else {
            object[trail[0]][trail[1]][trail[2]] = [
              object[trail[0]][trail[1]][trail[2]],
              value
            ]
          }
          break
        }
      }
    },
    hardcopy (value) {
      return JSON.parse(JSON.stringify(value))
    },
    collapseRows () {
      if (!this.collapseColumns.length) {
        this.collapsedFacts = []
        return
      }
      const columnsToGroupOn = this.collapsableColumns.filter(
        (column) => !this.collapseColumns.includes(column)
      )

      const groupedFacts = {}
      /** need a copy, so that we don't mutate the base */
      const factsCopy = this.hardcopy(this.facts)

      for (const fact of factsCopy) {
        let groupKey = ''

        for (const groupByColumn of columnsToGroupOn) {
          groupKey += this.getPropertyValue(fact, groupByColumn)
        }

        if (!groupedFacts[groupKey]) {
          groupedFacts[groupKey] = [fact]
        } else {
          groupedFacts[groupKey].push(fact)
        }
      }

      const groupedFactKeys = Object.keys(groupedFacts)

      for (const groupKey of groupedFactKeys) {
        let collapsedFact = {}
        const factsToCollapse = groupedFacts[groupKey]
        const numberOfFacts = factsToCollapse.length

        for (let factIndex = 0; factIndex < numberOfFacts; factIndex++) {
          if (factIndex === 0) {
            collapsedFact = factsToCollapse[factIndex]
          } else {
            const nextCollapsedFact = factsToCollapse[factIndex]
            for (const column of this.collapseColumns) {
              this.addValueToProperty(
                collapsedFact,
                column,
                this.getPropertyValue(nextCollapsedFact, column)
              )
            }
          }
        }
        this.collapsedFacts.push(collapsedFact)
      }
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

.facts-header th:hover {
  cursor: pointer;
  opacity: 0.8;
}

.facts-header th {
  border-bottom: none;
}

.filter-bar th {
  border-top: none;
}
</style>
