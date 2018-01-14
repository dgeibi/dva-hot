import { Router, Route, Link } from 'dva/router'
import React from 'react'
import hot from 'dva-hot'
import One from './routes/One'
import RandomNum from './component/RandomNum'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <>
        <div>
          <Link to="/">Home</Link> <Link to="/model-one">Model</Link>
        </div>
        <Route path="/model-one" component={One} />
        <RandomNum />
      </>
    </Router>
  )
}

export default hot.router(module)(RouterConfig)
