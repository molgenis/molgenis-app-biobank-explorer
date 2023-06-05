<template>
  <div class="mt-4" v-if="attribute.value && attribute.value.length">
    <div
      v-if="collapseColumns.length > 0"
      class="alert alert-dark"
      role="alert">
      Because of the adopted method of data creation and collection the number
      of donors presented in the table below should not be added as it may give
      the wrong sums.
    </div>
    <table class="table border w-100">
      <thead>
        <tr class="facts-header bg-secondary text-white">
          <th @click="sort('sample_type.label')">
            Material type
            <span
              v-if="sortColumn === 'sample_type.label'"
              class="fa"
              :class="sortAsc ? 'fa-sort-asc' : 'fa-sort-desc'"
              aria-hidden="true"></span>
          </th>
          <th @click="sort('sex.CollectionSex')">
            Sex
            <span
              v-if="sortColumn === 'sex.CollectionSex'"
              class="fa"
              :class="sortAsc ? 'fa-sort-asc' : 'fa-sort-desc'"
              aria-hidden="true"></span>
          </th>
          <th @click="sort('age.CollectionAgeRange')">
            Age range
            <span
              v-if="sortColumn === 'age.CollectionAgeRange'"
              class="fa"
              :class="sortAsc ? 'fa-sort-asc' : 'fa-sort-desc'"
              aria-hidden="true"></span>
          </th>
          <th @click="sort('disease.label')">
            Disease codes
            <span
              v-if="sortColumn === 'disease.label'"
              class="fa"
              :class="sortAsc ? 'fa-sort-asc' : 'fa-sort-desc'"
              aria-hidden="true"></span>
          </th>
          <th @click="sort('number_of_donors')">
            #Donors
            <span
              v-if="sortColumn === 'number_of_donors'"
              class="fa"
              :class="sortAsc ? 'fa-sort-asc' : 'fa-sort-desc'"
              aria-hidden="true"></span>
          </th>
          <th @click="sort('number_of_samples')">
            #Samples
            <span
              v-if="sortColumn === 'number_of_samples'"
              class="fa"
              :class="sortAsc ? 'fa-sort-asc' : 'fa-sort-desc'"
              aria-hidden="true"></span>
          </th>
        </tr>
        <tr class="filter-bar">
          <th>
            <select @change="filter('sample_type.label', $event)" class="w-100">
              <option value="all">All</option>
              <option
                v-for="material of materialtypeOptions"
                :key="material"
                :value="renderValue(material)">
                {{ renderValue(material) }}
              </option>
              <option value="Unknown">Unknown</option>
              <optgroup label="━━━━━━━━━━━━">
                <option value="collapse" class="ml-0 pl-0">
                  Collapse column
                </option>
              </optgroup>
            </select>
          </th>
          <th>
            <select @change="filter('sex.CollectionSex', $event)">
              <option value="all">All</option>
              <option
                v-for="sex of sexOptions"
                :key="sex"
                :value="renderValue(sex)">
                {{ renderValue(sex) }}
              </option>
              <option value="Unknown">Unknown</option>
              <optgroup label="━━━━━━━━━━━━">
                <option value="collapse" class="ml-0 pl-0">
                  Collapse column
                </option>
              </optgroup>
            </select>
          </th>

          <th>
            <select @change="filter('age.CollectionAgeRange', $event)">
              <option value="all">All</option>
              <option
                v-for="ageRange of ageRangeOptions"
                :key="ageRange"
                :value="renderValue(ageRange)">
                {{ renderValue(ageRange) }}
              </option>
              <option value="Unknown">Unknown</option>
              <optgroup label="━━━━━━━━━━━━">
                <option value="collapse" class="ml-0 pl-0">
                  Grouped together
                </option>
              </optgroup>
            </select>
          </th>
          <th>
            <select @change="filter('disease.label', $event)">
              <option value="all">All</option>
              <option
                v-for="disease of diseaseOptions"
                :key="disease"
                :value="renderValue(disease)">
                {{ renderValue(disease) }}
              </option>
              <option value="Unknown">Unknown</option>
              <optgroup label="━━━━━━━━━━━━">
                <option value="collapse" class="ml-0 pl-0">
                  Group column
                </option>
              </optgroup>
            </select>
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fact of factsTable">
          <tr :key="fact.id" v-if="hasAFactToShow(fact)">
            <th
              scope="row"
              class="pr-1 align-top"
              :class="{
                'text-nowrap': !collapseColumns.includes('sample_type.label'),
              }">
              {{ renderNestedValue(fact.sample_type, "label") }}
            </th>
            <td>{{ renderNestedValue(fact.sex, "CollectionSex") }}</td>
            <td>{{ renderNestedValue(fact.age, "CollectionAgeRange") }}</td>
            <td
              :class="{
                'text-nowrap': !collapseColumns.includes('disease.label'),
              }"
              :title="renderNestedValue(fact.disease, 'id')">
              {{ renderNestedValue(fact.disease, "label") }}
            </td>
            <td>{{ renderValue(fact.number_of_donors) }}</td>
            <td>{{ renderValue(fact.number_of_samples) }}</td>
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
  data () {
    return {
      facts: [],
      sortColumn: '',
      sortAsc: false,
      filters: [],
      collapseColumns: [],
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
        ...new Set(
          this.attribute.value
            .map((attr) => attr.sample_type?.label)
            .filter((l) => l)
        )
      ]
    },
    sexOptions () {
      return [
        ...new Set(
          this.attribute.value
            .map((attr) => attr.sex?.CollectionSex)
            .filter((l) => l)
        )
      ]
    },
    ageRangeOptions () {
      return [
        ...new Set(
          this.attribute.value
            .map((attr) => attr.age?.CollectionAgeRange)
            .filter((l) => l)
        )
      ]
    },
    diseaseOptions () {
      return [
        ...new Set(
          this.attribute.value
            .map((attr) => attr.disease?.label)
            .filter((l) => l)
        )
      ]
    },
    factsTable () {
      if (this.filters.length === 0) return this.facts
      const filteredFacts = []

      const lastFilterIndex = this.filters.length - 1

      for (const fact of this.facts) {
        for (const [index, filter] of this.filters.entries()) {
          const propertyValue = this.getValue(fact, filter.column)
          /** it did not match all filters, so goodbye. */
          if (!propertyValue && filter.value !== 'Unknown') {
            continue
          } else if (!propertyValue && filter.value === 'Unknown') {
            filteredFacts.push(fact)
          } else if (propertyValue !== filter.value) {
            continue
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
          this.copyFactsToComponentState()
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
        const factAProperty = this.getValue(factA, column)
        const factBProperty = this.getValue(factB, column)

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
    renderValue (value) {
      if (!value) return 'Unknown'
      /** we cannot collapse numbers, so handle it here instead if fixing it in the object itself */
      if (!isNaN(value) && this.collapseColumns.length > 0) return '*'

      if (Array.isArray(value)) {
        return value.join(', ')
      } else return value
    },
    renderNestedValue (object, property) {
      if (!object || !object[property]) return 'Unknown'
      const value = object[property]

      if (Array.isArray(value)) {
        return value.join(', ')
      } else return value
    },
    getValue (object, propertyString) {
      const trail = propertyString.split('.')
      const trailLength = trail.length

      let value
      let next = object
      for (let trailIndex = 0; trailIndex < trailLength; trailIndex++) {
        const trailPart = trail[trailIndex]

        if (!next[trailPart]) return value
        else {
          value = next[trailPart]
          next = next[trailPart]
        }
      }
      return value
    },
    addValue (object, propertyString, value) {
      value = value ?? 'Unknown'

      let newValue = []
      const currentValue = this.getValue(object, propertyString)
      const currentValueIsArray = Array.isArray(currentValue)
      const valueIsArray = Array.isArray(value)

      if (currentValueIsArray && valueIsArray) {
        newValue = currentValue.concat(value)
      } else if (!currentValueIsArray && valueIsArray) {
        newValue = value
        newValue.push(currentValue)
      } else if (currentValueIsArray && !valueIsArray) {
        newValue = currentValue
        newValue.push(value)
      } else {
        newValue = [currentValue, value]
      }

      /** deduplicate */
      newValue = [...new Set(newValue)]

      /** now traverse the path and assign it by reference */
      const trail = propertyString.split('.')
      const trailLength = trail.length
      let next = object

      for (let trailIndex = 0; trailIndex < trailLength; trailIndex++) {
        const trailPart = trail[trailIndex]

        if (!next[trailPart] || trailIndex + 1 === trailLength) {
          next[trailPart] = newValue
          break
        } else {
          next = next[trailPart]
        }
      }
    },

    hardcopy (value) {
      return JSON.parse(JSON.stringify(value))
    },
    collapseRows () {
      if (!this.collapseColumns.length) {
        /** no group together selected, so reset the state */
        this.copyFactsToComponentState()
        return
      }
      const columnsToGroupOn = this.collapsableColumns.filter(
        (column) => !this.collapseColumns.includes(column)
      )

      const groupedFacts = {}

      for (const fact of this.facts) {
        let groupKey = ''

        for (const groupByColumn of columnsToGroupOn) {
          groupKey += this.getValue(fact, groupByColumn)
        }

        if (!groupedFacts[groupKey]) {
          groupedFacts[groupKey] = [fact]
        } else {
          groupedFacts[groupKey].push(fact)
        }
      }

      const collapsedFacts = []
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
              this.addValue(
                collapsedFact,
                column,
                this.getValue(nextCollapsedFact, column)
              )
            }
          }
        }
        collapsedFacts.push(collapsedFact)
      }
      /** set the collapsed fact to the table */
      this.facts = collapsedFacts
    },
    /** making a hardcopy, so we can alter it without issues */
    copyFactsToComponentState () {
      this.facts = this.hardcopy(this.attribute.value)
    }
  },
  mounted () {
    this.copyFactsToComponentState()
  }
}
</script>

<style scoped>
tr th:not(:first-child),
tr td:not(:first-child) {
  text-align: left;
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
