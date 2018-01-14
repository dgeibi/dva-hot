import dva from 'dva'
import hot from 'dva-hot'
import router from './router'
import one from './models/one'

const app = dva()
hot.patch(app)
app.model(one)
app.router(router)
app.start('#root')
