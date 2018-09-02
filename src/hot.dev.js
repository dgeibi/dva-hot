const { render } = require('react-dom')
const { createElement } = require('react')

/* eslint-disable no-param-reassign, no-use-before-define */

let app
let root
let handleModelError
let currentRouter = null
const mountedModels = new WeakSet()

let hmrRender = router => {
  app.router(router)
  render(createElement(app.start()), root)
}

const hot = {
  patch(inst, container) {
    if (app) {
      console.error("[hot.patch] You have been patch app, don't patch app twice")
      return inst
    }
    if (!isDvaInstance(inst)) {
      console.error('[hot.patch] app should be a `dva` instance')
      return inst
    }
    app = inst
    if (container !== undefined) {
      hot.setContainer(container)
    }
    patchAppStart(inst)
    patchAppModel(inst)
    patchAppRouter(inst)
    console.log('[dva-hot] enabled.')
    return inst
  },

  setContainer(container) {
    container = normalizeContainer(container)
    if (!container) {
      console.error('container should be selector or Element')
    } else {
      root = container
    }
    return container
  },

  onModelError(fn) {
    handleModelError = fn
  },

  model(sourceModule, handleError) {
    if (!isNodeModule(sourceModule)) {
      throw Error('[hot.model] should pass `module` first')
    }
    if (sourceModule.hot) {
      return model => {
        if (!isDvaModel(model)) {
          throw Error('[hot.model] model shoule be a obj and has `namespace` prop')
        }
        sourceModule.hot.accept(handleError || handleModelError)
        sourceModule.hot.dispose(data => {
          if (mountedModels.has(model)) {
            mountedModels.delete(model)
            model = undefined
            data.enabled = true
          }
        })
        if (shouldReplaceModule(sourceModule)) {
          if (app.replaceModel) {
            app.replaceModel(model)
          } else {
            app.unmodel(model.namespace)
            app.model(model)
          }
        }
        return model
      }
    }
    return passthrough
  },

  router(sourceModule, handleError) {
    if (!isNodeModule(sourceModule)) {
      throw Error('[hot.router] should pass `module` first')
    }
    if (sourceModule.hot) {
      return router => {
        if (!isFunction(router)) {
          throw Error('[hot.router] router should be a function')
        }
        sourceModule.hot.accept(handleError)
        sourceModule.hot.dispose(data => {
          data.enabled = currentRouter === router
          router = undefined
        })
        if (shouldReplaceModule(sourceModule)) {
          replaceRouter(router)
        }
        return router
      }
    }
    return passthrough
  },
}

module.exports = hot

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

function replaceRouter(router) {
  currentRouter = router
  hmrRender(router)
}

function normalizeContainer(container) {
  if (isString(container)) {
    container = document.querySelector(container)
  }
  if (isHTMLElement(container)) {
    return container
  }
  return null
}

function shouldReplaceModule(sourceModule) {
  return app && root && sourceModule.hot.data && sourceModule.hot.data.enabled
}

function patchAppStart(inst) {
  const oldStart = inst.start
  inst.start = container => {
    if (container !== undefined) {
      container = hot.setContainer(container)
    }
    if (container) {
      app.use({
        onHmr(r) {
          hmrRender = r
        },
      })
    }
    return oldStart.call(inst, container)
  }
}

function patchAppModel(inst) {
  const oldMethod = inst.model
  inst.model = m => {
    if (isDvaModel(m)) {
      mountedModels.add(m)
    }
    return oldMethod.call(inst, m)
  }
}

function patchAppRouter(inst) {
  const oldMethod = inst.router

  inst.router = r => {
    if (isFunction(r)) {
      currentRouter = r
    }
    return oldMethod.call(inst, r)
  }
}
