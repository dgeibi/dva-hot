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

app.model(require('./models/a').default)
app.model(require('./models/b').default)
app.router(require('./router').default)

hot.patch(app).start('#root')
```

**Self-accepted Model**

``` js
import hot from 'dva-hot'

export default hot.model(module)({
  namespace: 'a-dva-model'
  state: [],
})
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

## LICENSE

[ISC](LICENSE)

[version-badge]: https://img.shields.io/npm/v/dva-hot.svg
[package]: https://www.npmjs.com/package/dva-hot
