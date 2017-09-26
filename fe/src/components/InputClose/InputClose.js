import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import styles from './InputClose.less'
import { Input, Select, Button, Icon } from 'antd'

class InputClose extends React.Component {

  // props 设置默认值
  static defaultProps = {
    name: 'default'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      show: false
    }
  }

  // https://facebook.github.io/react/docs/handling-events.html
  // 如果使用 emitEmpty(){...} 就需要在组件里面通过 this.emitEmpty.bind(this)
  emitEmpty = () => {
    // 找到真实 dom
    // ReactDOM.findDOMNode(this.refs.searchInput).querySelector('input').value=""
    this.refs.searchInput.refs.input.value = ''
    this.setState({
      show: false,
      value: ''
    })
    // 默认页面链接 ?name=xiaoming
    // 如果使用 null，则链接为 ?name
    // 如果使用''，页面链接为 ?name=
    // 如果使用 undefined，则页面链接不会出现该字段
    this.props.onChange(undefined)
  }

  change = (v) => {
    this.setState({
      show: !!v.target.value,
      value: v.target.value
    })
    this.props.onChange(v.target.value || undefined)
  }

  // TODO:通过getFieldDecorator包装之后,resetFields不会刷新
  render() {
    return (
      <div>
        <Input ref="searchInput"
               size='large'
               value={this.state.value}
               placeholder={this.props.placeholder}
               onChange={this.change}
               suffix={this.state.show && <Icon type="close-circle" className={styles.show} onClick={this.emitEmpty} />}
        />
      </div>
    )
  }
}

InputClose.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  onChange: PropTypes.func
}

export default InputClose
