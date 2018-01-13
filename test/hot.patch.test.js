let hot

beforeEach(() => {
  jest.resetModules()
  hot = require('../src/hot.dev').default
})

test('log error if patch more than one time', () => {
  expect(() => {
    hot.patch({
      start: jest.fn(),
      model: jest.fn(),
      router: jest.fn(),
      use: jest.fn(),
    })
  }).not.toConsoleError()

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

test('patch works', () => {
  const old = {
    start: jest.fn(),
    model: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }

  const app = {
    ...old,
  }

  expect(() => {
    hot.patch(app)
  }).not.toConsoleError()
  expect(old.start).not.toEqual(app.start)
  expect(old.model).not.toEqual(app.model)
  expect(old.router).not.toEqual(app.router)
  app.start('body')
  expect(app.use).toBeCalled()
  expect(old.start).toBeCalled()
  app.model(null)
  expect(old.model).toBeCalled()
  app.router(null)
  expect(old.router).toBeCalled()
})

test('log error if pass container not exists', () => {
  const app = {
    start: jest.fn(),
    model: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }

  expect(() => {
    hot.patch(app, '#root')
  }).toConsoleError()
})

test('not call app.use if pass nothing to app.start', () => {
  const oldStart = jest.fn()
  const app = {
    start: oldStart,
    model: jest.fn(),
    unmodel: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }

  hot.patch(app).start()
  expect(app.use).not.toBeCalled()
  expect(oldStart).not.toEqual(app.start)
  expect(oldStart).toBeCalled()
})

test('log error if container not exists', () => {
  const app = {
    start: jest.fn(),
    model: jest.fn(),
    unmodel: jest.fn(),
    router: jest.fn(),
    use: jest.fn(),
  }
  hot.patch(app)
  expect(() => {
    app.start()
  }).not.toConsoleError()

  expect(() => {
    app.start('#root')
  }).toConsoleError()
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
