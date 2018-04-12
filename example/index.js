import { createElement } from 'react'
import { render } from 'react-dom'
import dva from 'dva'
import hot from 'dva-hot'
import router from './router'
import one from './models/one'
import two from './models/two'

const app = dva()
hot.patch(app)
app.model(one)
app.model(two)
app.router(router)

render(createElement(app.start()), hot.setContainer('#root'))
