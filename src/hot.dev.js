let app
let hmrRender
let root

function shouldReload() {
  return app && hmrRender && root
}

export default {
  patch(inst) {
    if (!isDvaInstance(inst)) {
      throw Error('[hot.patch] app should be a `dva` instance')
    }
    const oldStart = inst.start
    // eslint-disable-next-line
    inst.start = container => {
      if (isString(container)) {
        // eslint-disable-next-line
        container = document.querySelector(container)
      }

      if (isHTMLElement(container)) {
        app = inst
        root = container
        app.use({
          onHmr(render) {
            console.log('[dva-hot] enabled.')
            hmrRender = render
          },
        })
      } else {
        app = undefined
        root = undefined
        hmrRender = undefined
        console.warn('[dva-hot] disabled.')
      }
      return oldStart.call(inst, container)
    }
    return inst
  },

  model(sourceModule) {
    if (!isNodeModule(sourceModule)) {
      throw Error('[hot.model] should pass `module` first')
    }
    if (sourceModule.hot) {
      return model => {
        if (!isDvaModel(model)) {
          throw Error('[hot.model] model shoule be a obj and has `namespace` prop')
        }
        let { namespace } = model
        sourceModule.hot.accept()
        sourceModule.hot.dispose(() => {
          if (namespace) {
            app.unmodel(namespace)
            namespace = undefined
          }
        })
        if (shouldReload()) {
          try {
            app.model(model)
          } catch (e) {
            console.error('error', e)
          }
        }
        return model
      }
    }
    return passthrough
  },

  router(sourceModule) {
    if (!isNodeModule(sourceModule)) {
      throw Error('[hot.router] should pass `module` first')
    }
    if (sourceModule.hot) {
      return router => {
        if (!isFunction(router)) {
          throw Error('[hot.router] router should be a function')
        }
        sourceModule.hot.accept()
        if (shouldReload()) {
          const renderException = error => {
            const { render } = require('react-dom')
            const { createElement } = require('react')
            const RedBox = require('redbox-react')
            render(createElement(RedBox || RedBox.default, { error }), root)
          }
          const newRender = x => {
            try {
              hmrRender(x)
            } catch (error) {
              console.error('error', error)
              renderException(error)
            }
          }
          newRender(router)
        }
        return router
      }
    }
    return passthrough
  },
}

function isHTMLElement(node) {
  return typeof node === 'object' && node !== null && node.nodeType && node.nodeName
}

function isString(str) {
  return typeof str === 'string'
}

function isFunction(func) {
  return typeof func === 'function'
}

function isDvaInstance(inst) {
  return (
    inst &&
    isFunction(inst.start) &&
    isFunction(inst.model) &&
    isFunction(inst.router) &&
    isFunction(inst.use)
  )
}

function isDvaModel(obj) {
  return obj && obj.namespace
}

function isObject(obj) {
  return obj && typeof obj === 'object'
}

function passthrough(x) {
  return x
}

function isNodeModule(x) {
  return isObject(x) && 'id' in x
}
