import router from '../../../../src/router'
import api from '@molgenis/molgenis-api-client'

jest.mock('@molgenis/molgenis-api-client')

describe('Router', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  it('can stop navigation to configuration screen if user not SU', async () => {
    api.get = jest.fn().mockResolvedValue({ roles: ['ROLE_ANONYMOUS'] })

    // need to catch, because the redirect triggers an error.
    try {
      await router.push('/configuration')
    } catch (e) {
      expect(router.currentRoute.path).toBe('/catalogue')
    }
  })

  it('can continues to route if user is SU', async () => {
    api.get = jest.fn().mockResolvedValue({ roles: ['ROLE_SU'] })
    await router.push('/configuration')

    expect(router.currentRoute.path).toBe('/configuration')
  })
})
