import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, TreeSelect, Switch, Icon, Button } from 'antd'
import arrToTree from 'array-to-tree'
import axios from 'axios'
import styles from './Form.less'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const MenuForm = ({
  currItem, treeData, menuPermissionTreeData,
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    getFieldsValue,
  },
}) => {
  const getParentName = (parentId) => {
    if (!parentId) {
      return '该节点为根节点'
    }
    return treeData.filter(el => el.id === parentId)[0].name
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }

  const toLocation = () => {
    window.open('https://ant.design/components/icon-cn/')
  }

  const validateName = (rule, value, callback) => {
    if (currItem.id && value === currItem.name) {
      callback()
      return
    }
    axios.get('/sys/menus/menuNameValidation', { params: { q: value } }).then(() => callback(),
      (error) => {
        rule.message = error.response.data
        callback(new Error(error.response.data))
      })
  }

  const changeMenu = (checked) => {
    if (checked) {
      setFieldsValue({ menuLevel: 1 })
    } else {
      setFieldsValue({ menuLevel: -1 })
    }
  }

  return (
    <div>
      <Form layout="horizontal">
        <FormItem label="ID" hasFeedback {...formItemLayout} className={styles.hidden}>
          {getFieldDecorator('id', {
            initialValue: currItem && currItem.id,
          })(<Input />)}
        </FormItem>
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currItem && currItem.name,
            rules: [
              {
                required: true,
                message: '名称不能为空!',
                whitespace: true,
              },
              {
                validator: validateName,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="父菜单" hasFeedback {...formItemLayout}>
          {getFieldDecorator('parentName', {
            initialValue: currItem && getParentName(currItem.mpid),
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="导航菜单" {...formItemLayout}>
          <Switch defaultChecked={currItem && currItem.menuLevel !== -1} onChange={changeMenu} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} />
          {getFieldDecorator('menuLevel')(<Input type="hidden" />)}
        </FormItem>
        <FormItem label="父菜单ID" {...formItemLayout} className={styles.hidden}>
          {getFieldDecorator('mpid', {
            initialValue: currItem && currItem.mpid,
          })(<Input />)}
        </FormItem>
        <FormItem label="父面包屑ID" {...formItemLayout} className={styles.hidden}>
          {getFieldDecorator('bpid', {
            initialValue: currItem && currItem.bpid,
          })(<Input />)}
        </FormItem>
        <FormItem label="菜单链接" hasFeedback {...formItemLayout}>
          {getFieldDecorator('router', {
            initialValue: currItem && currItem.router,
          })(<Input placeholder="/sys/menu" />)}
        </FormItem>
        <FormItem label="图标" {...formItemLayout}>
          {getFieldDecorator('icon', {
            initialValue: currItem && currItem.icon,
          })(<Input placeholder="点击图标查找..." suffix={<span style={{ cursor: 'pointer' }} onClick={toLocation}><Icon type="picture" /></span>} />)}
        </FormItem>
        <FormItem label="关联权限" {...formItemLayout}>
          {getFieldDecorator('permission', { // setFieldsValue({permission:'11'})
            initialValue: currItem && currItem.permission && currItem.permission.toString(),
            rules: [
              {
                required: true,
                message: '权限不能为空',
                whitespace: true,
              }],
          })(
            <TreeSelect
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeData={arrToTree(menuPermissionTreeData, { parentProperty: 'parentId', customID: 'value', rootID: 1 })}
              treeDefaultExpandAll
            />
          )}
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" onClick={handleSubmit}>提交</Button>
        </FormItem>
      </Form>
    </div>
  )
}

MenuForm.propTypes = {
  currItem: PropTypes.object,
  location: PropTypes.object,
  getFieldDecorator: PropTypes.func,
  validateFields: PropTypes.func,
  setFieldsValue: PropTypes.func,
  getFieldsValue: PropTypes.func,
  treeData: PropTypes.array,
  menuPermissionTreeData: PropTypes.array,
  onOk: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create()(MenuForm)
