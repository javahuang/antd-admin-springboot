import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, TreeSelect } from 'antd'
import axios from 'axios'
import arrToTree from 'array-to-tree'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  permissionTreeData,
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

  const validateRoleName = (rule, value, callback) => {
    if (item.id && value === item.name) {
      callback()
      return
    }
    axios.get('/sys/roles/roleNameValidation', { params: { q: value } }).then(() => callback()
      , (error) => {
        rule.message = error.response.data
        callback(new Error(error.response.data))
      })
  }

  // key value title
  const convert = (permissions) => {
    const treeNodes = []
    permissions.forEach((ele) => {
      treeNodes.push({
        value: `${ele.id}`,
        label: `${ele.name}`,
        key: `${ele.id}`,
        parentId: ele.parentId,
      })
    })
    return treeNodes
  }

  const onChange = (value) => {
    console.log(arguments)
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="角色名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '角色名称不能为空!',
                whitespace: true,
              },
              {
                validator: validateRoleName,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="权限列表" {...formItemLayout}>
          {getFieldDecorator('permissions', {
            initialValue: item && item.permissionIds && item.permissionIds.split(','),
          })(
            <TreeSelect
              showSearch
              multiple
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              onChange={onChange}
              treeData={arrToTree(convert(permissionTreeData), {
                parentProperty: 'parentId',
                customID: 'value',
                rootID: 1,
              })}
              treeDefaultExpandAll
            />
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
  permissionTreeData: PropTypes.any,
}

export default Form.create()(modal)
