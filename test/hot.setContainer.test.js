import hot from '../src/hot.dev'

test('log error if set nothing', () => {
  expect(() => {
    hot.setContainer()
  }).toConsoleError()
})

test('log error if element not exists', () => {
  expect(() => {
    hot.setContainer('#root')
  }).toConsoleError()
})

test('not log error if element exists', () => {
  expect(() => {
    hot.setContainer('body')
    hot.setContainer(document.body)
  }).not.toConsoleError()
})

test('pass element if element exists', () => {
  expect(hot.setContainer('body')).toBe(document.body)
})
