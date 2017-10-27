<template>
  <div v-if="biobank.data.collections">
    <router-link :to="{path: '/biobankexplorer', query: query}">Back to searching through biobanks</router-link>

    <div class="card biobank-card">
      <div class="card-header">
        <h3>{{biobank.data.name}}</h3>

        <small>
          <dl class="row">
            <dt class="col-sm-2"><b>Biobank type:</b></dt>
            <dd class="col-sm-10"><i>{{ biobankTypes }}</i></dd>
            <dt class="col-sm-2"><b>Number of collections:</b></dt>
            <dd class="col-sm-10"><i>{{ biobank.data.collections.length }}</i></dd>
            <dt class="col-sm-2"><b>Number of samples:</b></dt>
            <dd class="col-sm-10"><i>{{ numberOfSamples }}</i></dd>
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
    background-color: #ffffff;
  }

  .biobank-card {
    margin-top: 1em;
  }

  .fa-times {
    color: darkred;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable'

  import { mapState } from 'vuex'
  import { GET_BIOBANK_REPORT } from '../../store/actions'
  import utils from 'src/utils'

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
      biobankTypes () {
        if (this.biobank.data.collections) {
          return utils.getUniqueIdArray(this.biobank.data.collections.reduce((accumulator, collection) => {
            return accumulator.concat(collection.materials.map(material => material.label))
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
