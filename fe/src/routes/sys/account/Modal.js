import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, Select } from 'antd'
import axios from 'axios'
import styles from './Modal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  onOk,
  roles,
  loginUser,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  if (!item.isAdmin) {
    item.isAdmin = 0 // 设置默认非管理员
  }


  const validateLoginName = (rule, value, callback) => {
    if (item.id || !value) {
      callback()
      return
    }
    axios.get('/sys/accounts/loginNameValidation', { params: { q: value } }).then(() => {
      callback()
    }, (error) => {
      rule.message = error.response.data
      callback(new Error(error.response.data))
    })
  }

  const handleConfirmBlur = (e) => {
    const value = e.target.value
    let { confirm } = getFieldsValue()
    if (confirm && confirm !== value) {
      validateFields(['confirm'], { force: true })
    }
  }

  const checkPassword = (rule, value, callback) => {
    // if (item.id) {
    //   callback()
    //   return
    // }
    let { password } = getFieldsValue()
    if (value && value !== password) {
      callback('两次密码输入不一致')
    } else {
      callback()
    }
  }
  const checkConfirm = (rule, value, callback) => {
    // if (item.id) {
    //   callback()
    //   return
    // }
    let { confirm } = getFieldsValue()
    if (confirm) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const buildOptions = () => {
    const children = []
    roles.forEach((ele) => {
      children.push(<Option key={ele.id}>{ele.name}</Option>)
    })
    return children
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="姓名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '姓名不能为空!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem label="登录名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('loginName', {
            initialValue: item.loginName,
            rules: [
              {
                required: true,
                message: '登录名不能为空!',
              }, {
                validator: validateLoginName,
              },
            ],
          })(<Input disabled={!!item.id} />)}
        </FormItem>
        {/* 管理员权限才能修改密码 */}
        <FormItem className={!!item.id && !loginUser.admin ? styles.hidden : ''}
          {...formItemLayout}
          label="密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: !item.id,
              message: '请输入密码',
            }, {
              validator: checkConfirm,
            }],
          })(
            <Input type="password" onBlur={handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem className={!!item.id && !loginUser.admin ? styles.hidden : ''}
          {...formItemLayout}
          label="密码确认"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: !item.id,
              message: '请再输入一遍密码确认',
            }, {
              validator: checkPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="是否管理员" {...formItemLayout}>
          {getFieldDecorator('isAdmin', {
            initialValue: item.isAdmin,
          })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="性别" {...formItemLayout}>
          {getFieldDecorator('sex', {
            initialValue: item.sex || 1,
          })(
            <RadioGroup>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="手机号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('telNumber', {
            initialValue: item.telNumber,
            rules: [
              {
                required: true,
                pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
                message: '手机号格式不正确!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="邮箱" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              {
                required: true,
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: '邮箱格式不正确!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="角色列表" {...formItemLayout}>
          {getFieldDecorator('roleIds', {
            initialValue: (item && item.roleIds && item.roleIds.split(',')) || [],
          })(
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择"
            >
              {buildOptions()}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  roles: PropTypes.array,
  loginUser: PropTypes.object,
}

export default Form.create()(modal)
