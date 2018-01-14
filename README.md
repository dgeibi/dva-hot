# dva-hot

[![version][version-badge]][package]

HMR plugin for dva without babel inspired by [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) and [react-hot-loader](https://github.com/gaearon/react-hot-loader).

## Install

``` sh
$ npm install dva-hot
$ npm install redbox-react --save-dev
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

After dva's [commit 77a6fa](https://github.com/dvajs/dva/commit/77a6fa13bcbd899baad245a45fc98fbfd2623cd5), the following usage should work:

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

const container = document.querySelector('#root')
// experimental: pass container for HMR
render(createElement(app.start()), hot.setContainer(container))
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

**WARNING: hot model replacement may cause loss of state!**

``` js
import hot from 'dva-hot'

export default hot.model(module)({
  namespace: 'a-dva-model'
  state: [],
})
```

## LICENSE

[ISC](LICENSE)

[version-badge]: https://img.shields.io/npm/v/dva-hot.svg
[package]: https://www.npmjs.com/package/dva-hot
