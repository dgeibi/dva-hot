module.exports = () => `
import hot from 'dva-hot'

const model = hot.model(module)({
  namespace: 'two',
  state: {
    value: 1
  },
  reducers: {
    getRandom() {
      return {
        value: 1 + ${Math.random()}
      };
    },
  },
})

export default model
`
