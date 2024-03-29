import Router from '../router'

function setBookmark (bookmark) {
  Router.push(
    {
      name: Router.name,
      path: Router.path,
      query: bookmark
    },
    /**  to prevent error, which occurs on routing to same page (Vue issue) */
    () => { }
  )
}

export const createBookmark = (filters, collectionCart) => {
  const { selections, satisfyAll } = filters

  const bookmark = {}
  /** Selections is an object which holds the information on every filter about which option / string has been supplied */
  if (selections && Object.keys(selections).length > 0) {
    for (const property in selections) {
      const value = selections[property]

      /** can't do if(!value) because that would also trigger if value === 0 */
      if (value === '' || value === null || value === undefined || value.length === 0) { continue }

      if (Array.isArray(value) && value.length > 0) {
        bookmark[property] = encodeURI(value.join(','))
      } else {
        bookmark[property] = encodeURI(value)
      }
    }
  }

  /** This manages the selection in the cart */
  if (collectionCart && collectionCart.length) {
    const bookmarkIds = collectionCart.map(s => s.value)
    const encodedCart = Buffer.from(bookmarkIds.join(',')).toString('base64')
    bookmark.cart = encodeURI(encodedCart)
  }

  if (satisfyAll && satisfyAll.length) {
    bookmark.satisfyAll = encodeURI(satisfyAll.join(','))
  }

  setBookmark(bookmark)
}

export default {
  createBookmark
}
