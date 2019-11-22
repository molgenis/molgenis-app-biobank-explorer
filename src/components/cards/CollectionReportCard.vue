<template>
  <div class="container mg-collection-report-card">
    <div class="row">
      <div class="col">
        <!-- Back to previous page buttons -->
        <router-link v-if="this.prevRoute && this.prevRoute.fullPath !== '/'" :to="this.prevRoute.fullPath"
                     name="previous">
          <em class="fa fa-angle-left"></em> Back
        </router-link>
        <router-link v-else-if="this.report" :to="`/biobank/report/${this.report.biobank.id}`" name="biobank">
          <em class="fa fa-angle-left"></em> Back to biobank
        </router-link>
      </div>
    </div>

    <div class="row" v-if="this.report">
      <div class="col">
        <!-- Title -->
        <report-title type="Collection" :id="report.id" :name="report.name"></report-title>

        <div class="container">
          <div class="row">
            <div class="col-8">
              <!-- Description -->
              <report-description :description="report.description"></report-description>

              <!-- Collection details -->
              <report-details-table :tableContent="detailsTableContent"></report-details-table>
            </div>

            <!-- Right side card -->
            <div class="col-4">
              <div class="card">
                <div class="card-body">
                  <div class="card-text">
                    <!-- Contact -->
                    <h5>Contact Information</h5>
                    <report-details-list :reportDetails="detailsListContent.contact"></report-details-list>
                    <!-- Biobank -->
                    <h5>Biobank</h5>
                    <report-details-list :reportDetails="detailsListContent.biobank"></report-details-list>
                    <!-- Quality -->
                    <h5>Quality</h5>
                    <report-details-list :reportDetails="detailsListContent.quality"></report-details-list>
                    <!-- Collaboration -->
                    <h5>Collaboration</h5>
                    <report-details-list :reportDetails="detailsListContent.collaboration"></report-details-list>
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
  import ReportDescription from './ReportDescription.vue'
  import ReportTitle from './ReportTitle.vue'
  import ReportDetailsTable from './ReportDetailsTable.vue'
  import ReportDetailsList from './ReportDetailsList.vue'

  export default {
    name: 'CollectionReportCard',
    components: {ReportTitle, ReportDescription, ReportDetailsTable, ReportDetailsList},
    methods: {
      ...mapActions({
        getCollectionReport: GET_COLLECTION_REPORT
      })
    },
    computed: {
      ...mapState({report: state => state.collectionReport}),
      ageRange () {
        let ageRange = ''
        if ((this.report.age_low || this.report.age_low === 0) && this.report.age_high) {
          ageRange = `${this.report.age_low}-${this.report.age_high} `
        } else if (this.report.age_low || this.report.age_low === 0) {
          ageRange = `> ${this.report.age_low} `
        } else if (this.report.age_high) {
          ageRange = `< ${this.report.age_high} `
        }
        if (ageRange.length > 0 && this.report.age_unit.length) {
          ageRange += this.report.age_unit.map((unit) => unit.label).join()
        } else {
          ageRange = undefined
        }
        return ageRange
      },
      detailsTableContent () {
        return {
          stringValues: {
            Size: this.report.order_of_magnitude.size ? this.report.order_of_magnitude.size + ' participants' : undefined,
            Age: this.ageRange
          },
          listValues: {
            Type: {
              values: this.report.type ? this.report.type.map((type) => type.label) : [],
              badgeColor: 'info'
            },
            Sex: {
              values: this.report.sex ? this.report.sex.map((sex) => sex.label) : [],
              badgeColor: 'secondary'
            },
            Materials: {
              values: this.report.materials ? this.report.materials.map((material) => material.label) : [],
              badgeColor: 'danger'
            },
            Storage: {
              values: this.report.storage_temperatures ? this.report.storage_temperatures.map((temp) => temp.label) : [],
              badgeColor: 'warning'
            },
            Data: {
              values: this.report.data_categories ? this.report.data_categories.map((data) => data.label) : [],
              badgeColor: 'primary'
            },
            Diagnosis: {
              values: this.report.diagnosis_available ? this.report.diagnosis_available.map((diagnosis) => diagnosis.label) : [],
              badgeColor: 'primary'
            }
          }
        }
      },
      detailsListContent () {
        return {
          contact: {
            name: {
              value: this.report.head_lastname ? `${this.report.head_firstname} ${this.report.head_lastname} ${this.report.head_role ? '(' + this.report.head_role + ')' : ''} ` : undefined,
              type: 'string'
            },
            email: {
              value: this.report.contact && this.report.contact.email ? this.report.contact.email : undefined,
              type: 'email'
            },
            phone: {
              value: this.report.contact && this.report.contact.phone ? this.report.contact.phone : undefined,
              type: 'phone'
            }
          },
          biobank: {
            name: {value: this.report.biobank.name, type: 'string'},
            juridical_person: {value: this.report.biobank.juridical_person, type: 'string'},
            country: {value: this.report.country.name, type: 'string'},
            website: {value: this.report.biobank.url, type: 'url'},
            email: {value: this.report.biobank.email, type: 'email'}
          },
          quality: {
            'Partner charter': {value: this.report.biobank.partner_charter_signed, type: 'bool'},
            Certification: {value: this.report.biobank.quality.map((quality) => quality.label), type: 'list'}
          },
          collaboration: {
            Commercial: {value: this.report.collaboration_commercial, type: 'bool'},
            'Not for profit': {value: this.report.collaboration_non_for_profit, type: 'bool'}
          }
        }
      }
    },
    data () {
      return {
        prevRoute: undefined
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
