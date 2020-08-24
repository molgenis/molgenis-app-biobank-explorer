
# Main architecture

```mermaid
stateDiagram-v2

%% Sets the order of components: %%

    App.vue
    BiobankExplorerContainer.vue 
    FilterContainer.vue
    Search
    Covid19
    Covid19Services
    DiagnosisAvailableFilter.vue
    GenericFilters
    Countries
    ResultHeader.vue
    ActiveFilterList.vue
    Negotiator.vue
    BiobankCard.vue
    BiobankCardsContainer.vue
    BiobankReportCard.Vue
    CollectionsTable.vue
    CollectionReportCard.vue
    QualityColumn.vue
    SubCollectionsTable.vue
    NetworkReportCard.vue
    ReportDescription.vue
    ReportDetailsList.vue
    ReportCollection.vue
    ReportTitle.vue

State ReportComponents {

    ReportTitle.vue
    ReportDetailsList.vue
    ReportDescription.vue
    ReportCollection.vue
    ReportSubCollection.vue
}

%% Set relations: %%

App.vue --> BiobankExplorerContainer.vue

BiobankExplorerContainer.vue -->  FilterContainer.vue
BiobankExplorerContainer.vue -->  ResultHeader.vue
BiobankExplorerContainer.vue -->  Negotiator.vue
BiobankExplorerContainer.vue -->  BiobankCardsContainer.vue

FilterContainer.vue --> Search : String
FilterContainer.vue --> Covid19 : Checkbox
FilterContainer.vue --> Covid19Services : Checkbox
FilterContainer.vue --> GenericFilters : String / Checkbox
FilterContainer.vue --> Countries
FilterContainer.vue --> DiagnosisAvailableFilter.vue

ResultHeader.vue --> ActiveFilterList.vue

BiobankCardsContainer.vue --> BiobankCard.vue 

BiobankCard.vue --> BiobankReport : Vue Router Link
BiobankCard.vue --> CollectionsTable.vue


BiobankReportCard.vue --> ReportComponents
BiobankReportCard.vue --> NetworkReportCard.vue : Vue Router
CollectionReportCard.vue --> ReportComponents
CollectionReportCard.vue --> NetworkReportCard.vue : Vue Router
NetworkReportCard.vue --> ReportComponents

ReportCollection.vue --> ReportSubCollection.vue
ReportSubCollection.vue --> ReportSubCollection.vue : Parent - Child Relation
ReportSubCollection.vue --> CollectionReportCard.vue : Vue Router Link
ReportSubCollection.vue --> ReportDetailsList.vue

ReportDetailsList.vue --> ?_ReportCard : Dynamic Router Link

CollectionsTable.vue -->  CollectionReportCard.vue : Vue Router Link
CollectionsTable.vue -->  QualityColumn.vue
CollectionsTable.vue -->  SubCollectionsTable.vue

SubCollectionsTable.vue --> SubCollectionsTable.vue : Parent - Child Relation
SubCollectionsTable.vue --> CollectionReportCard.vue : Vue Router Link

%% Notes %%

note left of Countries: Can be turned off through options
note right of ActiveFilterList.vue: Chips indicating active filters and their value
note left of GenericFilters: Generic filters based on JSON
note left of BiobankCardsContainer.vue: Renders biobanks as BiobankCard
note right of Negotiator.vue: Button to Request data

```

## 3rd party components

### Spinner
- vue-loading-overlay

### Tools used to create this document

- Visual Studio Code

- https://mermaid-js.github.io/mermaid/#/README

- https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid