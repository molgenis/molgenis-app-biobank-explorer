import { generateBadgeColor } from '../../../../src/utils/generatorUtils'

describe('BadgeColor Generator', () => {
  it('should not return two the same colors', () => {
    const colors = []
    for (let i = 0; i < 5; i++) {
      colors.push(generateBadgeColor())
    }

    const colorCount = colors.length
    const distinctCount = [...new Set(colors)].length

    expect(colorCount).toEqual(distinctCount)
  })
})
