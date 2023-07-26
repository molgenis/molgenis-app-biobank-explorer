<template>
  <div class="mt-4" v-if="attribute.value && attribute.value.length">
    <div>
      <label class="font-weight-bold mr-3">Split by:</label>
      <div class="d-inline-flex justify-content-around w-50">
        <label>
          <input
            type="checkbox"
            name="sample_type.label"
            @change="(e) => toggleColumn(e, 'sample_type.label')"
            :checked="columnChecked('sample_type.label')"/>
          Material type
        </label>
        <label>
          <input
            type="checkbox"
            @change="(e) => toggleColumn(e, 'sex.CollectionSex')"
            :checked="columnChecked('sex.CollectionSex')"/>
          Sex
        </label>
        <label>
          <input
            type="checkbox"
            @change="(e) => toggleColumn(e, 'age.CollectionAgeRange')"
            :checked="columnChecked('age.CollectionAgeRange')"/>
          Age range
        </label>
        <label>
          <input
            type="checkbox"
            @change="(e) => toggleColumn(e, 'disease.label')"
            :checked="columnChecked('disease.label')"/>
          Disease codes
        </label>
      </div>
    </div>
    <div
      v-if="collapseColumnsOrder.length > 0"
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
            </select>
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fact of factsTable">
          <tr :key="fact.id" v-if="hasAFactToShow(fact)">
            <th scope="row" class="pr-1 align-top">
              {{ renderNestedValue(fact.sample_type, "label") }}
            </th>
            <td>{{ renderNestedValue(fact.sex, "CollectionSex") }}</td>
            <td>{{ renderNestedValue(fact.age, "CollectionAgeRange") }}</td>
            <td :title="renderNestedValue(fact.disease, 'id')">
              {{ renderNestedValue(fact.disease, "label") }}
            </td>
            <td>{{ renderValue(fact.number_of_donors) }}</td>
            <td>{{ renderSamplesValue(fact.number_of_samples) }}</td>
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
      collapseColumnsOrder: []
    }
  },
  watch: {
    collapseColumnsOrder () {
      this.collapseRows()
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
    columnChecked () {
      return (column) => !this.collapseColumnsOrder.includes(column)
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
    toggleColumn (e, columnName) {
      if (e.target.checked) {
        const columnIndex = this.collapseColumnsOrder.findIndex(
          (cco) => cco === columnName
        )
        this.collapseColumnsOrder.splice(columnIndex, 1)
      } else {
        this.collapseColumnsOrder.push(columnName)
      }
    },
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
      if (!isNaN(value) && this.collapseColumnsOrder.length > 0) {
        return 'available'
      }

      if (Array.isArray(value)) {
        return value.join(', ')
      } else return value
    },
    renderSamplesValue (value) {
      if (!value) return 'Unknown'

      if (Array.isArray(value)) {
        const sum = value.reduce((prev, next) => prev + next)
        return sum
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

        if (!next[trailPart]) return value ?? 'Unknown'
        else {
          value = next[trailPart]
          next = next[trailPart]
        }
      }
      return value ?? 'Unknown'
    },
    hardcopy (value) {
      return JSON.parse(JSON.stringify(value))
    },
    collapseObject (from, to) {
      const keysOfFact = Object.keys(from)
      for (const key of keysOfFact) {
        const value = this.getValue(from, key)
        const valueType = typeof value

        if (Array.isArray(value)) {
          if (to[key] && !Array.isArray(value)) {
            if (!to[key].includes(value)) {
              to[key].push(value)
            }
          } else if (Array.isArray(value)) {
            if (to[key]) {
              to[key] = [...new Set(to[key].concat(value))]
            } else {
              to[key] = value
            }
          } else { to[key] = value }
        } else if (valueType === 'object') {
          if (to[key]) {
            to[key] = this.collapseObject(value, to[key])
          } else {
            to[key] = value
          }
        } else if (key === 'number_of_donors') {
          to[key] = 'available'
        } else if (key === 'number_of_samples') {
          to[key] = to[key] ? to[key] + parseInt(value) : parseInt(value)
        } else {
          if (to[key]) {
            if (typeof to[key] === 'string') {
              if (to[key] !== value) {
                to[key] = [to[key], value]
              }
            } else {
              if (!to[key].includes(value)) {
                to[key].push(value)
              }
            }
          } else {
            to[key] = [value]
          }
        }
      }
      return to
    },
    collapseRows () {
      if (!this.collapseColumnsOrder.length) {
        /** no group together selected, so reset the state */
        this.copyFactsToComponentState()
        return
      }

      /** make a copy that we can keep mutating utill we have dealt with all the collapses.
       * order matters!
       */
      let groupedFacts = this.hardcopy(this.facts)
      for (const groupByColumn of this.collapseColumnsOrder) {
        const groupBy = {}
        for (const fact of groupedFacts) {
          let groupKey = ''
          groupKey += this.getValue(fact, groupByColumn)

          if (!groupBy[groupKey]) {
            groupBy[groupKey] = [fact]
          } else {
            groupBy[groupKey].push(fact)
          }
        }

        const collapsedFacts = []
        const groupedFactKeys = Object.keys(groupBy)

        for (const groupKey of groupedFactKeys) {
          let collapsedFact = {}
          const factsToCollapse = groupBy[groupKey]

          for (const fact of factsToCollapse) {
            collapsedFact = this.collapseObject(fact, collapsedFact)
          }

          collapsedFacts.push(collapsedFact)
        }
        groupedFacts = collapsedFacts
        /** set the collapsed fact to the table */
      }
      this.facts = groupedFacts
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
