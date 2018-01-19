import React, { Component } from 'react'
import { connect } from 'dva'

class Two extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'two/getRandom',
    })
  }
  render() {
    const { two } = this.props
    return <div>[two] model value: {String(two)}</div>
  }
}

export default connect(state => ({
  two: state.two,
}))(Two)
