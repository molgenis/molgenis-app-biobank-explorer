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

export const createBookmark = (router, selections) => {
  const bookmark = {}

  if (Object.keys(selections).length > 0) {
    for (const property in selections) {
      const value = selections[property]
      if (value === '' || value === null || value === undefined || value.length === 0) { break } // can't do if(!value) because that would also trigger if value === 0

      if (Array.isArray(value)) {
        bookmark[property] = encodeURI(value.join(','))
      } else {
        bookmark[property] = encodeURI(value)
      }
    }
  }
  setBookmark(router, bookmark)
}

export default {
  createBookmark
}
