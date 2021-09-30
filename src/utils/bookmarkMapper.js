import state from '../store/state'
import Router from '../router'

function setBookmark (bookmark) {
  Router.push(
    {
      name: Router.name,
      path: Router.path,
      query: bookmark
    },
    // to prevent error, which occurs on routing to same page (Vue issue)
    () => { }
  )
  if (state.isIE11) {
    state.ie11Bookmark = `${window.location.host}/#${Router.currentRoute.fullPath}`
  }
}
export const createBookmark = (filters, selection, satisfyAllSelection) => {
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

  setBookmark(bookmark)
}

export default {
  createBookmark
}
