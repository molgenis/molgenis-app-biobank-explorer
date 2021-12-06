export const generateBadgeColor = (prevBadgeColor) => {
  const badgeColors = ['info', 'secondary', 'danger', 'primary', 'success']
  let nextBadgeColor = 0

  if (prevBadgeColor === -1) {
    prevBadgeColor = 0
  } else {
    nextBadgeColor = prevBadgeColor === 4 ? 0 : prevBadgeColor + 1
  }
  prevBadgeColor = nextBadgeColor

  return { prevBadgeColor, badgeColor: badgeColors[nextBadgeColor] }
}
