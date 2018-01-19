module.exports = () => `
import hot from 'dva-hot'

const model = hot.model(module)({
  namespace: 'two',
  state: 1,
  reducers: {
    getRandom() {
      return 1 + ${Math.random()};
    },
  },
})

export default model
`
