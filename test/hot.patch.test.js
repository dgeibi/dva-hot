const { create } = require('dva-core')

let hot

beforeEach(() => {
  jest.resetModules()
  hot = require('../src/hot.dev')
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

test('dynamic model', () => {
  const app = create()
  app.use = jest.fn()
  app.router = jest.fn()

  expect(() => {
    hot.patch(app)
  }).not.toConsoleError()

  let prevDispose
  const fakeSourceModule = {
    id: 11,
    hot: {
      data: {},
      accept: jest.fn(),
      dispose: fn => {
        prevDispose = fn
      },
    },
  }
  const modelWrapper = hot.model(fakeSourceModule)
  const addModelFactory = x => ({
    namespace: 'counter',
    state: 0,
    reducers: {
      add(state) {
        return state + x
      },
    },
  })

  // import counter
  const counterModel = modelWrapper(addModelFactory(1))
  app.model(counterModel)
  app.start('body')

  app._store.dispatch({ type: 'counter/add' })
  expect(app._store.getState().counter).toEqual(1)

  // alter model 1st
  fakeSourceModule.hot.data = {}
  prevDispose(fakeSourceModule.hot.data)
  modelWrapper(addModelFactory(2))
  app._store.dispatch({ type: 'counter/add' })
  expect(app._store.getState().counter).toEqual(3)

  // alter model 2nd
  fakeSourceModule.hot.data = {}
  prevDispose(fakeSourceModule.hot.data)
  modelWrapper(addModelFactory(3))
  app._store.dispatch({ type: 'counter/add' })
  expect(app._store.getState().counter).toEqual(6)

  // alter model 3rd
  fakeSourceModule.hot.data = {}
  prevDispose(fakeSourceModule.hot.data)
  modelWrapper(addModelFactory(4))
  app._store.dispatch({ type: 'counter/add' })
  expect(app._store.getState().counter).toEqual(10)
})
