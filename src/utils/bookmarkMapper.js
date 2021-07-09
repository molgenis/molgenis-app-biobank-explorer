import state from '../store/state'

function setBookmark (router, bookmark) {
  router.push(
    {
      name: router.name,
      path: router.path,
      query: bookmark
    },
    // to prevent error, which occurs on routing to same page (Vue issue)
    () => { }
  )
  if (state.isIE11) {
    state.ie11Bookmark = `${window.location.host}/#${router.currentRoute.fullPath}`
  }
}
export const createBookmark = (router, filters, selection, satisfyAllSelection) => {
  if (!router) return

  const bookmark = {}

  if (filters && Object.keys(filters).length > 0) {
    for (const property in filters) {
      const value = filters[property]
      if (value === '' || value === null || value === undefined || value.length === 0) { continue } // can't do if(!value) because that would also trigger if value === 0

      if (Array.isArray(value) && value.length > 0) {
        bookmark[property] = encodeURI(value.join(','))
      } else {
        bookmark[property] = encodeURI(value)
      }
    }
  }

  if (selection && selection.length) {
    const bookmarkIds = selection.map(s => s.value)
    bookmark.cart = encodeURI(btoa(bookmarkIds.join(',')))
  }

  if (satisfyAllSelection && satisfyAllSelection.length) {
    bookmark.satisfyAll = encodeURI(satisfyAllSelection.join(','))
  }

  setBookmark(router, bookmark)
}

export default {
  createBookmark
}
