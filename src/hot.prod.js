const passthrough = x => x
const makethrough = () => passthrough

export default {
  patch: passthrough,
  model: makethrough,
  router: makethrough,
  setContainer: x => {
    if (typeof x === 'string') {
      return document.querySelector(x)
    }
    return isHTMLElement(x) ? x : null
  },
}

function isHTMLElement(node) {
  return typeof node === 'object' && node !== null && node.nodeType && node.nodeName
}
