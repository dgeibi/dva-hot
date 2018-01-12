import hot from '../src/hot.dev'

test('detect srcModule', () => {
  expect(() => {
    hot.router(null)
  }).toThrow()

  expect(() => {
    hot.router({})
  }).toThrow()

  expect(() => {
    hot.router({
      id: 2,
    })
  }).not.toThrow()
})

test('detect router', () => {
  const sourceModule = {
    id: 11,
    hot: {
      accept: jest.fn(),
    },
  }
  const wrapRouter = hot.router(sourceModule)
  expect(() => wrapRouter()).toThrow()
  expect(() => wrapRouter(jest.fn())).not.toThrow()
})

test('accept hmr after passing router', () => {
  const sourceModule = {
    id: 11,
    hot: {
      accept: jest.fn(),
    },
  }
  const wrapRouter = hot.router(sourceModule)
  expect(sourceModule.hot.accept).not.toBeCalled()
  wrapRouter(() => {})
  expect(sourceModule.hot.accept).toBeCalled()
})
