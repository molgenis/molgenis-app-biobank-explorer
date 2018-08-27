import {fetchAllBiobanks, fetchBiobankIds} from '../client/biobank-client'
import Bacon from 'baconjs'
/**
 * Reactive module that keeps biobanks up to date given filter state.
 * Here's an example execution documented using marble diagrams.
 *
 * $allBiobanks retrieves all biobanks once upon module load:
 * -----Z|
 *
 * Rsql filter changes get pushed by the app to $rsql:
 * ----------ab---c-------d--------->
 *
 * Rapidly successive changes get debounced, so biobanks are retrieved for B, C and D:
 * getBiobankIds(b):
 *            ------B|
 * getBiobankIds(c):
 *                -----C|
 * getBiobankIds(d):
 *                        -----D|
 *
 * $retrieved emits retrieved values that are up to date, so it will emit C and D, but not B.
 * --------------------C-------D----->
 *
 * $biobankIds emits undefined on $rsql changes and merges that with $retrieved:
 * ----------u---------C--u----D----->
 *
 * @module reactive-biobank-client
 */

/**
 * Retrieves all biobanks once and then finishes.
 * @type {Bacon.EventStream}
 */
export const $allBiobanks = Bacon.fromPromise(fetchAllBiobanks())

/**
 * The bus to push updated rsql values on.
 * @type {Bacon.Bus}
 */
export const $rsql = new Bacon.Bus()

/**
 * Intermediate property that emits Biobank IDs retrieved for the value on the $rsql bus.
 * Debounces the $rsql changes for 500 millis.
 * Combines with the $allBiobanks stream to get a value for empty search string
 * Then uses flatMapLatest to make sure that results are only emitted if they correspond to the latest change in $rsql.
 * @type {Bacon.Property}
 */
const $retrieved = $rsql.debounce(500)
  .combine($allBiobanks, (rsql, allBiobanks) => ({rsql, allBiobankIds: allBiobanks.map(biobank => biobank.id)}))
  .flatMapLatest(({rsql, allBiobankIds}) => Bacon.fromPromise(fetchBiobankIds(rsql, allBiobankIds)))

/**
 * Current biobankIds.
 * Emits undefined immediately when $rsql changes.
 * Emits list of biobankIds when up to date list of biobankIds arrives.
 * @type {Bacon.EventStream}
 */
export const $biobankIds = $rsql.toEventStream().map(() => undefined).merge($retrieved.toEventStream()).skipDuplicates()
