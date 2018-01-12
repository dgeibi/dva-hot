import hot from '../src/hot.dev'

test('detect srcModule', () => {
  expect(() => {
    hot.model(null)
  }).toThrow()

  expect(() => {
    hot.model({})
  }).toThrow()

  expect(() => {
    hot.model({
      id: 2,
    })
  }).not.toThrow()
})

test('accept hmr after passing model', () => {
  const sourceModule = {
    id: 11,
    hot: {
      accept: jest.fn(),
      dispose: jest.fn(),
    },
  }
  const wrapModel = hot.model(sourceModule)

  expect(sourceModule.hot.accept).not.toBeCalled()
  expect(sourceModule.hot.dispose).not.toBeCalled()

  wrapModel({
    namespace: 'app',
  })

  expect(sourceModule.hot.accept).toBeCalled()
  expect(sourceModule.hot.dispose).toBeCalled()
})

test('detect model', () => {
  const sourceModule = {
    id: 11,
    hot: {
      accept: jest.fn(),
      dispose: jest.fn(),
    },
  }
  const acceptModel = hot.model(sourceModule)

  expect(() => {
    acceptModel()
  }).toThrow()

  expect(() => {
    acceptModel({})
  }).toThrow()
})
