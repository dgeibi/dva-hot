const passthrough = x => x
const makethrough = () => passthrough

function isHTMLElement(node) {
  return typeof node === 'object' && node !== null && node.nodeType && node.nodeName
}

module.exports = {
  patch: passthrough,
  model: makethrough,
  router: makethrough,
  onModelError() {},
  setContainer: x => {
    if (typeof x === 'string') {
      return document.querySelector(x)
    }
    return isHTMLElement(x) ? x : null
  },
}
