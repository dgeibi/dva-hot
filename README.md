# dva-hot

[![version][version-badge]][package]

HMR plugin for dva without babel inspired by [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) and [react-hot-loader](https://github.com/gaearon/react-hot-loader).

## Install

``` sh
$ npm install dva-hot
```

## Usage

**Patch App**

``` js
import hot from 'dva-hot'
import dva from 'dva'

const app = dva()

hot.patch(app) // you must patch `app` before calling app.{model,router,start}

app.model(require('./models/a').default)
app.model(require('./models/b').default)
app.router(require('./router').default)

app.start('#root')
```

After `dva@2.2.2`, the usage below should work:

``` js
import hot from 'dva-hot'
import dva from 'dva'
import { createElement } from 'react'
import { render } from 'react-dom'

const app = dva()

hot.patch(app) // you can pass container to hot.patch like `hot.patch(app, container)`

app.model(require('./models/a').default)
app.model(require('./models/b').default)
app.router(require('./router').default)

// After dva@2.2.2: pass container for HMR
render(createElement(app.start()), hot.setContainer('#root'))
// or
// render(createElement(app.start()), hot.setContainer(document.querySelector('#root')))
```

**Self-accepted Router**

``` js
import React from 'react'
import { routerRedux } from 'dva/router'
import { renderRoutes } from 'react-router-config'
import hot from 'dva-hot'
import routes from '../routes'

const { ConnectedRouter } = routerRedux

function RouterConfig({ history }) {
  return <ConnectedRouter history={history}>{renderRoutes(routes)}</ConnectedRouter>
}

export default hot.router(module)(RouterConfig)
```

**Self-accepted Model**

``` js
import hot from 'dva-hot'

export default hot.model(module)({
  namespace: 'a-dva-model'
  state: [],
  // upgrade to dva@2.2.2 if you use models that without `reducers`
})
```

## LICENSE

[ISC](LICENSE)

[version-badge]: https://img.shields.io/npm/v/dva-hot.svg
[package]: https://www.npmjs.com/package/dva-hot
