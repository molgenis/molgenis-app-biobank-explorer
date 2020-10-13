<template>
  <div class="container mg-collection-report-card">
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"
    ></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <!-- Back to previous page buttons -->
          <button class="btn btn-link" @click="back">
            <i class="fa fa-angle-left" aria-hidden="true"></i> Back
          </button>
        </div>
      </div>

      <div class="row" v-if="this.collection && !this.isLoading">
        <div class="col">
          <report-title
            type="Collection"
            :name="collection.name"
          ></report-title>

          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <p>
                  <b>Id:</b>
                  {{ collection.id }}
                </p>
                <report-description
                  :description="collection.description"
                  :maxLength="500"
                ></report-description>
                <report-details-list
                  :reportDetails="mainContent"
                ></report-details-list>
                <div
                  v-if="
                    collection.sub_collections &&
                    collection.sub_collections.length
                  "
                  class="mt-2"
                >
                  <h5>Sub collections</h5>
                  <report-sub-collection
                    v-for="subCollection in subCollections"
                    :collection="subCollection"
                    :key="subCollection.id"
                    :level="1"
                  ></report-sub-collection>
                </div>
              </div>

              <!-- Right side card -->
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-text">
                      <template v-if="info.head">
                        <div class="mb-2">
                          <span>{{ info.head }}</span>
                        </div>
                      </template>
                      <template v-if="info.contact">
                        <h5>Contact Information</h5>
                        <ul class="right-content-list">
                          <li v-if="info.contact.name">
                            {{ info.contact.name }}
                          </li>
                          <li v-if="info.contact.email">
                            <span
                              class="fa fa-fw fa-paper-plane mr-2"
                              aria-hidden="true"
                            ></span>
                            <a :href="'mailto:' + info.contact.email">
                              <span>Email</span>
                            </a>
                            <div v-if="info.contact.phone">
                              <span
                                class="fa fa-fw fa-phone mr-1"
                                aria-hidden="true"
                              ></span>
                              <a :href="'tel:' + info.contact.phone">
                                <span> {{ info.contact.phone }}</span></a
                              >
                            </div>
                          </li>
                        </ul>
                      </template>
                      <template v-if="info.biobank">
                        <h5>Biobank</h5>
                        <ul class="right-content-list">
                          <li>
                            <div>
                              {{ info.biobank.name }}
                            </div>
                            <div>
                              {{ info.biobank.juridical_person }}
                            </div>
                            <div>
                              {{ info.biobank.country }}
                            </div>
                          </li>
                          <li>
                            <div v-if="info.biobank.report">
                              <span
                                class="fa fa-fw fa-address-card mr-2"
                                aria-hidden="true"
                              ></span>
                              <router-link :to="info.biobank.report">
                                <span>View {{ info.biobank.name }}</span>
                              </router-link>
                            </div>
                            <div v-if="info.biobank.website">
                              <span
                                class="fa fa-fw fa-globe mr-2"
                                aria-hidden="true"
                              ></span>
                              <a
                                :href="info.biobank.website"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span>Website</span>
                              </a>
                            </div>
                            <div v-if="info.biobank.email">
                              <span
                                class="fa fa-fw fa-paper-plane mr-2"
                                aria-hidden="true"
                              ></span>
                              <a :href="'mailto:' + info.biobank.email">
                                <span>Email</span>
                              </a>
                            </div>
                          </li>
                          <li>
                            <div class="container p-0">
                              <div class="row">
                                <div class="col pr-0">
                                  <span class="font-weight-bold"
                                    >Partner charter:</span
                                  >
                                </div>
                                <div class="col p-0">
                                  <span class="badge badge-info">
                                    {{ info.biobank.partnerCharter }}</span
                                  >
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <span class="font-weight-bold mr-2"
                              >Biobank id:</span
                            >
                            <span class="biobank-id">{{ info.biobank.id }}</span>
                          </li>
                        </ul>
                      </template>
                      <template
                        v-if="info.networks && info.networks.length > 0"
                      >
                        <h5>Networks</h5>
                        <ul class="right-content-list">
                          <li>
                            <div
                              class="info-list"
                              v-for="(network, index) in info.networks"
                              :key="`${network.name}-${index}`"
                            >
                              <span class="font-weight-bold mr-2">Name:</span>
                              <span>{{ network.name }}</span>
                              <div>
                                <span
                                  class="fa fa-fw fa-address-card mr-2"
                                  aria-hidden="true"
                                ></span>
                                <router-link :to="network.report">
                                  <span>View {{ network.name }} network</span>
                                </router-link>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </template>
                      <template
                        v-if="
                          info.certifications && info.certifications.length > 0
                        "
                      >
                        <h5>Quality</h5>
                        <ul class="right-content-list">
                          <li>
                            <span class="font-weight-bold mr-2"
                              >Certification(s):</span
                            >
                            <span
                              v-for="(cert, index) in info.certifications"
                              :key="`${cert}-${index}`"
                            >
                              <span class="cert-badge badge badge-success">
                                {{ cert }}
                              </span>
                            </span>
                          </li>
                        </ul>
                      </template>
                      <template v-if="info.collaboration.length > 0">
                        <h5>Collaboration</h5>
                        <div class="container p-0">
                          <div
                            class="row"
                            v-for="(collab, index) in info.collaboration"
                            :key="`${collab.name}-${index}`"
                          >
                            <div class="col pr-0">
                              <span class="font-weight-bold"
                                >{{ collab.name }}:</span
                              >
                            </div>
                            <div class="col p-0">
                              <span class="badge badge-info">{{
                                collab.value
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
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
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { GET_COLLECTION_REPORT } from '@/store/actions'
import ReportDescription from '@/components/report-components/ReportDescription.vue'
import ReportTitle from '@/components/report-components/ReportTitle.vue'
import ReportDetailsList from '@/components/report-components/ReportDetailsList.vue'
import ReportSubCollection from '@/components/report-components/ReportSubCollection'
import {
  mapDetailsTableContent,
  mapCollectionsData,
  collectionReportInformation
} from '@/utils/templateMapper'

export default {
  name: 'CollectionReportCard',
  components: {
    ReportTitle,
    ReportDescription,
    ReportDetailsList,
    ReportSubCollection,
    Loading
  },
  methods: {
    ...mapActions({
      getCollectionReport: GET_COLLECTION_REPORT
    }),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ collection: 'collectionReport', isLoading: 'isLoading' }),
    mainContent () {
      return this.collection ? mapDetailsTableContent(this.collection) : {}
    },
    info () {
      return collectionReportInformation(this.collection)
    },
    subCollections () {
      return this.collection &&
        this.collection.sub_collections &&
        this.collection.sub_collections.length
        ? mapCollectionsData(this.collection.sub_collections)
        : []
    },
    collectionId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    }
  },
  // needed because if we route back the component is not destroyed but its props are updated for other collection
  watch: {
    $route (to, from) {
      if (from.name.indexOf('collection') >= 0) {
        location.reload()
      }
    }
  },
  mounted () {
    this.getCollectionReport([this.collectionId])
  }
}
</script>

<style scoped>
.biobank-id {
  word-break: break-all;
}

.right-content-list {
  list-style-type: none;
  margin-left: -2.5rem;
}
.right-content-list:not(:last-child) {
  margin-bottom: 1.5rem;
}

.right-content-list li {
  margin-bottom: 0.5rem;
}

.info-list {
  margin-bottom: 1rem;
}

.cert-badge:not(:last-child) {
  margin-right: 1rem;
}
</style>
