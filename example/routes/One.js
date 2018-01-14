import React, { Component } from 'react'
import { connect } from 'dva'

const set = new Set()
class One extends Component {
  render() {
    const { one } = this.props
    set.add(one && one[0])
    if (one === undefined) {
      throw Error('[model] hmr lost state')
    }
    return <div>model values: {[...set]}</div>
  }
}

export default connect(state => ({
  one: state.one,
}))(One)
