const passthrough = x => x
const makethrough = () => passthrough

export default {
  patch: passthrough,
  model: makethrough,
  router: makethrough,
  setContainer: passthrough,
}
