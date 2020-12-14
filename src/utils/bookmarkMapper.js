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
}

export const createBookmark = (router, filters, selection) => {
  const bookmark = {}

  if (Object.keys(filters).length > 0) {
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
  if (selection.length) {
    bookmark.cart = encodeURI(btoa(JSON.stringify({ selection })))
  }

  setBookmark(router, bookmark)
}

export default {
  createBookmark
}
