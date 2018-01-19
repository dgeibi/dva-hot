import React, { Component } from 'react'
import { connect } from 'dva'

class One extends Component {
  render() {
    const { one } = this.props
    return <div>[one] model value: {String(one)}</div>
  }
}

export default connect(state => ({
  one: state.one,
}))(One)
