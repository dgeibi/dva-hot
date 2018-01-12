import hot from '../src/hot.dev'

test('detect dvaInstance', () => {
  expect(() => {
    hot.patch({})
  }).toThrow()

  expect(() => {
    hot.patch({ start: 'any' })
  }).toThrow()

  expect(() => {
    hot.patch({
      start: jest.fn(),
      model: jest.fn(),
      router: jest.fn(),
      use: jest.fn(),
    })
  }).not.toThrow()
})

test('patch start works', () => {
  const oldStart = jest.fn()
  const app = {
    start: oldStart,
    model: jest.fn(),
    unmodel: jest.fn(),
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
