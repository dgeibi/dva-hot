module.exports = () => `
import hot from 'dva-hot'

const model = hot.model(module)({
  namespace: 'one',
  state: ${Math.random()},
})

export default model
`
