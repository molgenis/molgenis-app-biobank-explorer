export const createColumnKey = (property) => {
  return property[0].toUpperCase() + property.slice(1)
}
