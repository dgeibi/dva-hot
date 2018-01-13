let hot

beforeEach(() => {
  jest.resetModules()
  hot = require('../src/hot.dev').default
})

test('throws if patch more than one time', () => {
  hot.patch({
    start: jest.fn(),
    model: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  })
  expect(() => {
    hot.patch({
      start: jest.fn(),
      model: jest.fn(),
      router: jest.fn(),
      use: jest.fn(),
    })
  }).toConsoleError()
})

test('detect dvaInstance', () => {
  expect(() => {
    hot.patch({})
  }).toConsoleError()

  expect(() => {
    hot.patch({ start: 'any' })
  }).toConsoleError()

  expect(() => {
    hot.patch({
      start: jest.fn(),
      model: jest.fn(),
      router: jest.fn(),
      use: jest.fn(),
    })
  }).not.toConsoleError()
})

test('patch start works', () => {
  const oldStart = jest.fn()
  const app = {
    start: oldStart,
    model: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }

  hot.patch(app).start('body')
  expect(app.use).toBeCalled()
  expect(oldStart).not.toEqual(app.start)
  expect(oldStart).toBeCalled()
})

test('disable hot if pass nothing to app.start', () => {
  const oldStart = jest.fn()
  const app = {
    start: oldStart,
    model: jest.fn(),
    unmodel: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }

  hot.patch(app).start(null)
  expect(app.use).not.toBeCalled()
  expect(oldStart).not.toEqual(app.start)
  expect(oldStart).toBeCalled()
})

test('patched app.start support HTMLElement', () => {
  const oldStart = jest.fn()
  const app = {
    start: oldStart,
    model: jest.fn(),
    unmodel: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }

  hot.patch(app).start(document.body)
  expect(app.use).toBeCalled()
  expect(oldStart).toBeCalled()
})
