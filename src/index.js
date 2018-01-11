let hot // eslint-disable-line
import React from 'react'
import ReactDOM from 'react-dom'

const passthrough = x => x

if (process.env.NODE_ENV !== 'production' && module.hot) {
  let app
  let hmrRender
  let container

  function shouldReload() {
    return app && hmrRender && container
  }

  hot = {
    patch(inst) {
      if (process.env.NODE_ENV !== 'production' && module.hot) {
        if (!isDvaInstance(inst)) {
          throw Error('[hot.patch] app should be a `dva` instance')
        }
        const oldStart = inst.start
        // eslint-disable-next-line
        inst.start = selector => {
          if (isString(selector)) {
            const maybeContainer = document.querySelector(selector)
            if (isHTMLElement(maybeContainer)) {
              console.log('[HMR] inited with dva-hot')
              app = inst
              container = maybeContainer
              app.use({
                onHmr(render) {
                  hmrRender = render
                },
              })
            }
          }
          return oldStart.call(inst, selector)
        }
      }
      return inst
    },

    model(sourceModule) {
      if (process.env.NODE_ENV !== 'production' && sourceModule.hot) {
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
      if (process.env.NODE_ENV !== 'production' && sourceModule.hot) {
        return router => {
          if (!isFunction(router)) {
            throw Error('[hot.router] router be a function')
          }
          sourceModule.hot.accept()
          if (shouldReload()) {
            const renderException = error => {
              const RedBox = require('redbox-react')
              ReactDOM.render(
                React.createElement(RedBox || RedBox.default, { error }),
                container
              )
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
    return inst && isFunction(inst.start)
  }

  function isDvaModel(obj) {
    return obj && obj.namespace
  }
} else {
  const g = () => passthrough

  hot = {
    patch: passthrough,
    model: g,
    router: g,
  }
}

export default hot
