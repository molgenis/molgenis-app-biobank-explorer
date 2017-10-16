<template>
  <div class="card filter_option">
    <h5 class="card-header" @click="toggleOptions">
      <i class="fa fa-caret-up" aria-hidden="true" v-if="showContent"></i>
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
      <p class="text-right" v-if="options.length > 5" v-show="!showAllContent"><a href="#" @click="toggleAllOptions">
        <small><i><i class="fa fa-caret-down" aria-hidden="true"></i> Show more</i></small>
      </a></p>
      <p class="text-right" v-if="options.length > 5" v-show="showAllContent"><a href="#" @click="toggleAllOptions">
        <small><i><i class="fa fa-caret-up" aria-hidden="true"></i> Show less</i></small>
      </a></p>
    </div>
  </div>
</template>
<style lang="scss">
  @import "~variables";
  @import "~mixins";

  .filter_option {
    background-color: inherit;

  }
</style>
<script>
  import FilterCheckbox from './FilterCheckbox'
  import { SET_FILTER } from '../store/mutations'

  export default {
    name: 'categorical-filter',
    props: ['id', 'name', 'options'],
    components: {FilterCheckbox},
    data: function () {
      return {
        showContent: true,
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
        const self = this
        self.selectAll = !self.selectAll

        const checkboxes = this.$refs[this.id]
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = self.selectAll
        })

        let allOptions = []
        if (self.selectAll) {
          allOptions = self.options.map(function (option) { return option.id })
        }

        self.$store.commit(SET_FILTER, {name: self.id, newSelectedOptions: allOptions})

        return self.selectAll
      }
    }
  }
</script>
