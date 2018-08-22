<template>
  <div v-if="biobank.data.collections">
    <router-link :to="{path: '/biobankexplorer', query: query}">Back to search results</router-link>

    <div class="card biobank-card">
      <div class="card-header">
        <div class="row">
          <div class="col-md-10">
            <h3>{{biobank.data.name}}</h3>

            <small>
              <dl class="row">
                <dt class="col-sm-3"><b>Collection types:</b></dt>
                <dd class="col-sm-9"><i>{{ collectionTypes }}</i></dd>
                <dt class="col-sm-3"><b>Number of collections:</b></dt>
                <dd class="col-sm-9"><i>{{ biobank.data.collections.length }}</i></dd>
                <dt class="col-sm-3"><b>Number of samples:</b></dt>
                <dd class="col-sm-9"><i>{{ numberOfSamples }}</i></dd>
              </dl>
            </small>


            <p>{{biobank.data.description}}</p>

            <br/>

            <div class="row">
              <div class="col-md-6">
                <ul class="list-unstyled">
                  <li><b>{{ biobank.data.juridical_person }}</b></li>
                  <li v-if="biobank.data.contact.address">{{ biobank.data.contact.address }}</li>
                  <li>{{ biobank.data.contact.zip }} {{ biobank.data.contact.city }}</li>
                  <li>{{ biobank.data.country.name }}</li>
                </ul>
              </div>
              <div class="col-md-4">
                <ul class="list-unstyled">
                  <li><b>{{ biobank.data.contact.first_name }} {{ biobank.data.contact.last_name }}</b></li>
                  <li>Email: {{ biobank.data.contact.email }}</li>
                  <li>Tel: {{ biobank.data.contact.phone }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-2">
            <span v-if="biobank.data.quality.length > 0" class="row">
              <p v-for="standard in biobank.data.quality" class="col-12">
                <a :href="standard.certification_report" target="_blank" v-if="standard.certification_report">
                  <span v-if="standard.certification_image_link">
                  <img :src="standard.certification_image_link" style="max-width:9rem;max-height:5rem"
                       :alt="standard.label!=='Others'?standard.label:standard.certification_number"/>
                </span>
                <span v-else>{{generateQualityLabel(standard)}} <i
                  class="fa fa-check"></i></span>
                </a>
                <span v-else>
                  <span v-if="standard.certification_image_link">
                  <img :src="standard.certification_image_link" style="max-width:9rem;max-height:5rem"
                       :alt="generateQualityLabel(standard)"/>
                </span>
                <span v-else>{{generateQualityLabel(standard)}} <i
                  class="fa fa-check"></i></span>
                </span>
              </p>
            </span>
          </div>
        </div>
      </div>

      <div class="card-block">
        <div class="card">
          <div class="card-header more-info-header" @click.prevent="collapsed = !collapsed">
            <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
            <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
            More information
          </div>

          <div class="card-body" v-if="!collapsed">
            <dl class="row" v-for="(attribute, index) in biobank.metadata.attributes"
                v-if="showThisAttribute(attribute) && attribute.fieldType !== 'COMPOUND'">

              <dt class="col-sm-3">{{ attribute.label }}</dt>
              <dd class="col-sm-3" v-if="biobank.data[attribute.name] === undefined ||
                  biobank.data[attribute.name].length === 0">-
              </dd>

              <dd class="col-sm-9" v-else>
                <span v-if="attribute.fieldType === 'BOOL'">
                  <i v-if="biobank.data[attribute.name]" class="fa fa-check"></i>
                  <i v-else-if="!biobank.data[attribute.name]" class="fa fa-times"></i>
                </span>

                <span v-else-if="attribute.fieldType === 'HYPERLINK'">
                  <a :href="biobank.data[attribute.name]" target="_blank">{{ biobank.data[attribute.name] }}</a>
                </span>

                <span v-else-if="singleReferenceType(attribute.fieldType)">
                  {{ getSingleRefLabel(attribute, biobank.data[attribute.name]) }}
                </span>

                <span v-else-if="multipleReferenceType(attribute.fieldType)">
                  {{ getMultiRefLabels(attribute, biobank.data[attribute.name]) }}
                </span>

                <span v-else>
                    {{biobank.data[attribute.name]}}
                  </span>
              </dd>
            </dl>
          </div>
        </div>

        <h4 class="collection-header">Collections</h4>
        <collections-table :collections="biobank.data.collections"></collections-table>
      </div>
    </div>
  </div>
</template>

<style>
  .collection-header {
    padding: 1rem;
  }

  .more-info-header {
    background-color: #e4e4e4;
  }

  .biobank-card {
    margin-top: 1em;
  }

  .fa-times {
    color: darkred;
  }

  .fa-check {
    color: green;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable'

  import { mapState } from 'vuex'
  import { GET_BIOBANK_REPORT } from '../../store/actions'
  import utils from '../../utils'

  export default {
    name: 'biobank-report-card',
    data () {
      return {
        collapsed: true
      }
    },
    methods: {
      generateQualityLabel (standard) {
        return standard.label !== 'Others' ? standard.label : standard.certification_number
      },
      showThisAttribute (attribute) {
        return attribute.name !== '_href' && attribute.name !== 'collections' && attribute.name !== 'country' &&
          attribute.name !== 'contact' && attribute.name !== 'description'
      },
      singleReferenceType (type) {
        return type === 'XREF' || type === 'CATEGORICAL'
      },
      multipleReferenceType (type) {
        return type === 'MREF' || type === 'CATEGORICAL_MREF' || type === 'ONE_TO_MANY'
      },
      getSingleRefLabel (attribute, ref) {
        const labelAttribute = attribute.refEntity.labelAttribute
        return ref[labelAttribute]
      },
      getMultiRefLabels (attribute, refs) {
        const labelAttribute = attribute.refEntity.labelAttribute
        return refs.map(ref => ref[labelAttribute]).join(', ')
      }
    },
    computed: {
      ...mapState({
        biobank: 'biobankReport'
      }),
      query () {
        return this.$route.query
      },
      collectionTypes () {
        if (this.biobank.data.collections) {
          return utils.getUniqueIdArray(this.biobank.data.collections.reduce((accumulator, collection) => {
            return accumulator.concat(collection.type.map(type => type.label))
          }, [])).join(', ')
        }
      },
      numberOfSamples () {
        if (this.biobank.data.collections) {
          const numberOfSamples = this.biobank.data.collections.reduce((accumulator, collection) => {
            accumulator += collection.size ? collection.size : 0
            return accumulator
          }, 0)

          return numberOfSamples === 0 ? 'No sample size data available' : '~' + numberOfSamples
        }
      }
    },
    components: {
      CollectionsTable
    },
    mounted () {
      this.$store.dispatch(GET_BIOBANK_REPORT, this.$store.state.route.params.id)
    }
  }
</script>
