<template>
  <div class="container mg-collection-report-card">
    <div class="row">
      <div class="col">
        <!-- Back to previous page buttons -->
        <router-link v-if="this.prevRoute && this.prevRoute.fullPath !== '/'" :to="this.prevRoute.fullPath">
          <em class="fa fa-angle-left"></em> Back
        </router-link>
        <router-link v-else-if="this.collectionReport" :to="`/biobank/report/${this.collectionReport.biobank.id}`">
          <em class="fa fa-angle-left"></em> Back to biobank
        </router-link>
      </div>
    </div>

    <div class="row" v-if="this.collectionReport">
      <div class="col">
        <!-- Title -->
        <h4><span class="badge badge-secondary">Collection</span></h4>
        <h1>{{collectionReport.name}}</h1>
        <h5 class="mb-4">ID:{{collectionReport.id}}</h5>

        <div class="container">
          <div class="row">
            <div class="col-8">

              <!-- Description -->
              <p v-if="collectionReport.description">
                <strong>Description: </strong>{{collectionReport.description.substr(0,500)}}
                <span v-if="collectionReport.description.length > 499">
                  <span :style="{ display : descriptionClosed ? 'none' : 'inline'}">
                    {{collectionReport.description.substr(500)}}
                  </span>
                  <button @click="toggleDescription" class="btn btn-link p-0">
                    <span v-if="this.descriptionClosed"> ... show more <em class="fa fa-angle-down"></em></span>
                    <span v-else> show less <em class="fa fa-angle-up"></em></span>
                  </button>
                </span>
              </p>

              <!-- Collection details -->
              <table>
                <caption v-show="false">Collection details</caption>
                <tr>
                  <th scope="row">Size:</th>
                  <td>{{collectionReport.order_of_magnitude.size}} participants</td>
                </tr>
                <tr v-if="collectionReport.age_low">
                  <th scope="row">Age:</th>
                  <td>{{collectionReport.age_low}} {{collectionReport.age_unit.label}}</td>
                </tr>
                <tr>
                  <th scope="row">Type:</th>
                  <td><span v-for="type in collectionReport.type" class="badge badge-info m-1">{{type.label}}</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Sex:</th>
                  <td><span v-for="sex in collectionReport.sex" class="badge badge-secondary m-1">{{sex.label}}</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Materials:</th>
                  <td><span v-for="material in collectionReport.materials"
                            class="badge badge-danger m-1">{{material.label}}</span></td>
                </tr>
                <tr v-if="collectionReport.storage_temperatures.length > 0">
                  <th scope="row">Storage:</th>
                  <td><span v-for="temp in collectionReport.storage_temperatures" class="badge badge-warning m-1">
                    {{temp.label}}
                  </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Data:</th>
                  <td><span v-for="category in collectionReport.data_categories" class="badge badge-primary m-1">
                    {{category.label}}
                  </span>
                  </td>
                </tr>
                <tr v-if="collectionReport.diagnosis_available.length > 0">
                  <th scope="row">Diagnoses:</th>
                  <td><span v-for="diagnosis in collectionReport.diagnosis_available" class="badge badge-primary m-1">
                    {{diagnosis.label}}
                  </span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Right side card -->
            <div class="col-4">
              <div class="card">
                <div class="card-body">
                  <div class="card-text">

                    <!-- Concact -->
                    <h5>Contact Information</h5>
                    <dl>
                      <dd v-if="collectionReport.head_lastname">
                        {{collectionReport.head_firstname}} {{collectionReport.head_lastname}}
                        <span v-if="collectionReport.head_role"> ({{collectionReport.head_role}})</span>
                      </dd>
                      <dd v-if="collectionReport.contact && collectionReport.contact.email">
                        <a :href="'mailto:' + collectionReport.contact.email">
                          <em class="fa fa-paper-plane"></em> Email
                        </a>
                      </dd>
                      <dd v-if="collectionReport.contact && collectionReport.contact.phone">
                        <em class="fa fa-phone"></em> {{collectionReport.contact.phone}}
                      </dd>
                    </dl>

                    <!-- Biobank -->
                    <h5>Biobank</h5>
                    <dl>
                      <dd>{{collectionReport.biobank.name}}</dd>
                      <dd>{{collectionReport.biobank.juridical_person}}</dd>
                      <dd>{{collectionReport.country.name}}</dd>
                      <dd v-if="collectionReport.biobank.url">
                        <a :href="collectionReport.biobank.url"><em class="fa fa-globe"></em> Website</a>
                      </dd>
                      <dd v-if="collectionReport.biobank.email">
                        <a :href="'mailto:' + collectionReport.biobank.email">
                          <em class="fa fa-paper-plane"></em> Email
                        </a>
                      </dd>
                    </dl>

                    <!-- Quality -->
                    <h5>Quality</h5>
                    <dl>
                      <dd>
                        Partner charter:
                        <span v-if="collectionReport.biobank.partner_charter_signed" class="badge badge-success">
                          yes
                        </span>
                        <span v-else class="badge badge-danger">no</span>
                      </dd>
                      <dd v-if="collectionReport.biobank.quality.length > 0">
                        Certification:
                        <span v-for="quality in collectionReport.biobank.quality" class="badge badge-success">
                          {{quality.label}}
                        </span>
                      </dd>
                    </dl>

                    <!-- Collaboration -->
                    <h5>Collaboration</h5>
                    <dl>
                      <dd>
                        Commercial:
                        <span v-if="collectionReport.collaboration_commercial" class="badge badge-success">yes</span>
                        <span v-else class="badge badge-danger">no</span>
                      </dd>
                      <dd>
                        Not for profit:
                        <span v-if="collectionReport.collaboration_non_for_profit" class="badge badge-success">
                          yes
                        </span>
                        <span v-else class="badge badge-danger">no</span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { GET_COLLECTION_REPORT } from '../../store/actions'

  export default {
    name: 'CollectionReportCard',
    methods: {
      ...mapActions({
        getCollectionReport: GET_COLLECTION_REPORT
      }),
      toggleDescription () {
        this.descriptionClosed = !this.descriptionClosed
      }
    },
    computed: {
      ...mapState(['collectionReport'])
    },
    data () {
      return {
        prevRoute: undefined,
        descriptionClosed: true
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.prevRoute = from
      })
    },
    mounted () {
      const splittedUrl = this.$route.fullPath.split('/')
      this.getCollectionReport([splittedUrl[splittedUrl.length - 1]])
    }
  }
</script>
