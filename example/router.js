import { Router, Route, Link } from 'dva/router'
import React from 'react'
import hot from 'dva-hot'
import One from './routes/One'
import Two from './routes/Two'
import RandomNum from './component/RandomNum'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <>
        <div>
          <Link to="/">Home</Link> <Link to="/model-one">Model 1 (without reducers)</Link>{' '}
          <Link to="/model-two">Model 2 (with reducers)</Link>
        </div>
        <Route path="/model-one" component={One} />
        <Route path="/model-two" component={Two} />
        <RandomNum />
      </>
    </Router>
  )
}

export default hot.router(module)(RouterConfig)
