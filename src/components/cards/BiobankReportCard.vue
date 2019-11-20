<template>
  <div v-if="biobank.data.collections">
    <router-link :to="{path: '/biobankexplorer', query: query}"><em class="fa fa-angle-left"></em> Back to search results</router-link>

    <div class="card mt-3">
      <div class="card-header">
        <div class="row">
          <div class="col-md-10">
            <h3>{{biobank.data.name}}</h3>

            <small>
              <dl class="row">
                <dt class="col-sm-3"><strong>Collection types:</strong></dt>
                <dd class="col-sm-9"><em>{{ collectionTypes }}</em></dd>
                <dt class="col-sm-3"><strong>Number of collections:</strong></dt>
                <dd class="col-sm-9"><em>{{ biobank.data.collections.length }}</em></dd>
                <dt class="col-sm-3"><strong>Number of samples:</strong></dt>
                <dd class="col-sm-9"><em>{{ numberOfSamples }}</em></dd>
              </dl>
            </small>


            <p>{{biobank.data.description}}</p>

            <br/>

            <div class="row">
              <div class="col-md-6">
                <ul class="list-unstyled">
                  <li><strong>{{ biobank.data.juridical_person }}</strong></li>
                  <li v-if="biobank.data.contact.address">{{ biobank.data.contact.address }}</li>
                  <li>{{ biobank.data.contact.zip }} {{ biobank.data.contact.city }}</li>
                  <li>{{ biobank.data.country.name }}</li>
                </ul>
              </div>
              <div class="col-md-4">
                <ul class="list-unstyled">
                  <li><strong>{{ biobank.data.contact.first_name }} {{ biobank.data.contact.last_name }}</strong></li>
                  <li>Email: <a :href="'mailto:' + biobank.data.contact.email">{{biobank.data.contact.email}}</a></li>
                  <li v-if="biobank.data.contact.phone">Tel: {{ biobank.data.contact.phone }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-2">
            <quality-column :qualities="biobank.data.quality" spacing=1></quality-column>
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
                  <em v-if="biobank.data[attribute.name]" class="fa fa-check"></em>
                  <em v-else-if="!biobank.data[attribute.name]" class="fa fa-times"></em>
                </span>

                <span v-else-if="attribute.fieldType === 'HYPERLINK'">
                  <a :href="biobank.data[attribute.name]" target="_blank">{{ biobank.data[attribute.name] }}</a>
                </span>

                <span v-else-if="attribute.name === 'quality'">
                  <table class="table table-sm">
                    <tr v-for="quality in biobank.data.quality">
                      <td>
                        <a v-if=quality.certification_report :href="quality.certification_report" target="_blank">
                          {{generateQualityLabel(quality)}}
                        </a>
                        <span v-else>{{generateQualityLabel(quality)}}</span>
                      </td>
                      <td>
                        <span>{{quality.assess_level_bio.label}}</span>
                      </td>
                    </tr>
                  </table>
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

  .fa-times {
    color: darkred;
  }

  .fa-check {
    color: green;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable'
  import QualityColumn from '../tables/QualityColumn'

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
      showThisAttribute (attribute) {
        return attribute.name !== '_href' && attribute.name !== 'collections' && attribute.name !== 'country' &&
          attribute.name !== 'contact' && attribute.name !== 'description' &&
          attribute.name !== 'operational_standards' && attribute.name !== 'other_standards'
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
      },
      generateQualityLabel (quality) {
        return quality.label !== 'Others' ? quality.label : quality.certification_number
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
      CollectionsTable, QualityColumn
    },
    mounted () {
      this.$store.dispatch(GET_BIOBANK_REPORT, this.$store.state.route.params.id)
    }
  }
</script>
