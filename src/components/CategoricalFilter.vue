<template>
  <div>
    <div class="card filter_option" v-if="id !== 'disease_types'">
      <h5 class="card-header" @click="toggleOptions">
        <i class="fa fa-caret-up" aria-hidden="true" v-if="!showContent"></i>
        <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
        {{name}}
      </h5>

      <div class="card-block" v-show="showContent">
        <p class="text-right" @click="toggleSelect">
          <small v-show="!selectAll"><i><a href="#">Select all</a></i></small>
          <small v-show="selectAll"><i><a href="#">Deselect all</a></i></small>
        </p>

        <filter-checkbox v-for="(option, index) in options"
                         :key="option.id"
                         :id="option.id"
                         :label="option.label"
                         :name="option.name"
                         :index="index"
                         :showAll="showAllContent"
                         :partOf="id" :ref="id">
        </filter-checkbox>

        <p class="text-right" v-if="options.length > 5" v-show="!showAllContent">
          <a href="#" @click="toggleAllOptions">
            <small><i class="fa fa-caret-down" aria-hidden="true"> Show more</i></small>
          </a>
        </p>

        <p class="text-right" v-if="options.length > 5" v-show="showAllContent">
          <a href="#" @click="toggleAllOptions">
            <small><i class="fa fa-caret-up" aria-hidden="true"> Show less</i></small>
          </a>
        </p>
      </div>
    </div>

    <div class="card filter_option" v-else>
      <h5 class="card-header" @click="toggleOptions">
        <i class="fa fa-caret-up" aria-hidden="true" v-if="!showContent"></i>
        <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
        {{name}}
      </h5>

      <div class="card-block" v-show="true">
        <filter-multiselect :options="options"></filter-multiselect>
      </div>

    </div>
  </div>
</template>

<style>
  .filter_option {
    background-color: inherit;
  }
</style>

<script>
  import FilterCheckbox from './FilterCheckbox'
  import { SET_FILTER } from '../store/mutations'
  import FilterMultiselect from './FilterMultiselect.vue'

  export default {
    name: 'categorical-filter',
    props: ['id', 'name', 'options'],
    components: {
      FilterCheckbox,
      FilterMultiselect
    },
    data: function () {
      return {
        showContent: false,
        showAllContent: false,
        selectedOptions: this.$store.state[this.id],
        selectAll: false
      }
    },
    methods: {
      toggleOptions () {
        this.showContent = !this.showContent
        return this.showContent
      },
      toggleAllOptions () {
        this.showAllContent = !this.showAllContent
        return this.showAllContent
      },
      toggleSelect () {
        this.selectAll = !self.selectAll

        const checkboxes = this.$refs[this.id]
        checkboxes.forEach(checkbox => {
          checkbox.checked = this.selectAll
        })

        const allOptions = this.selectAll ? this.options.map(option => option.id) : []
        this.$store.commit(SET_FILTER, {name: this.id, newSelectedOptions: allOptions})

        return this.selectAll
      }
    }
  }
</script>
