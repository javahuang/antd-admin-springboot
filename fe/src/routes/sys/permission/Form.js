import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button } from 'antd'
import axios from 'axios'
import styles from './Form.less'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const PermissionForm = ({
  currItem, treeData,
  onOk,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
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

  const validateName = (rule, value, callback) => {
    if (currItem.id && value === currItem.name) {
      callback()
      return
    }
    axios.get('/sys/permissions/permissionNameValidation', { params: { q: value } }).then(() =>
      callback()
      , (error) => {
      rule.message = error.response.data
      callback(new Error(error.response.data))
    })
  }

  return (
    <div>
      <Form layout="horizontal">
        <FormItem label="ID" hasFeedback {...formItemLayout} className={styles.hidden}>
          {getFieldDecorator('id', {
            initialValue: currItem ? currItem.id : '',
          })(<Input />)}
        </FormItem>
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currItem ? currItem.name : '',
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
        <FormItem label="权限码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('code', {
            initialValue: currItem ? currItem.code : '',
            rules: [
              {
                required: true,
                message: '权限码不能为空!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="父节点" {...formItemLayout}>
          {getFieldDecorator('parentName', {
            initialValue: getParentName(currItem.parentId),
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="父节点ID" {...formItemLayout} className={styles.hidden}>
          {getFieldDecorator('parentId', {
            initialValue: currItem ? currItem.parentId : '',
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('isResource', {
            initialValue: currItem.isResource ? `${currItem.isResource}` : '',
            rules: [
              {
                required: true,
                message: '类型不能为空!',
                whitespace: true,
              },
            ],
          })(<Select placeholder="">
            <Option value="1">菜单</Option>
            <Option value="2">功能</Option>
          </Select>)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: currItem ? currItem.remark : '',
            rules: [
              {},
            ],
          })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit" loading={loading} onClick={handleSubmit}>提交</Button>
        </FormItem>
      </Form>
    </div>
  )
}

PermissionForm.propTypes = {
  currItem: PropTypes.object,
  location: PropTypes.object,
  treeData: PropTypes.array,
  loading: PropTypes.any,
  onOk: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create()(PermissionForm)
