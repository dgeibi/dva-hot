import { render } from 'react-dom'
import { createElement } from 'react'
import RedBox from 'redbox-react'

/* eslint-disable no-param-reassign */

let app
let root
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

  model(sourceModule) {
    if (!isNodeModule(sourceModule)) {
      throw Error('[hot.model] should pass `module` first')
    }
    if (sourceModule.hot) {
      return model => {
        if (!isDvaModel(model)) {
          throw Error('[hot.model] model shoule be a obj and has `namespace` prop')
        }
        sourceModule.hot.accept()
        sourceModule.hot.dispose(data => {
          if (mountedModels.has(model)) {
            data.namespace = model.namespace
            mountedModels.delete(model)
            model = undefined
            data.enabled = true
          }
        })
        if (shouldReplaceModule(sourceModule)) {
          try {
            app.unmodel(sourceModule.hot.data.namespace)
            app.model(model)
          } catch (e) {
            console.error('error', e)
            renderException(e)
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

export default hot

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

function renderException(error) {
  render(createElement(RedBox, { error }), root)
}

function replaceRouter(router) {
  currentRouter = router
  try {
    hmrRender(router)
  } catch (error) {
    console.error('error', error)
    renderException(error)
  }
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
