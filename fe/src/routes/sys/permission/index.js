import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { connect } from 'dva'
import PermissionForm from './Form'
import PermissionTree from './Tree'


const Permission = ({ location, dispatch, permission, loading }) => {
  const {
    expandedKeys, searchValue, autoExpandParent,
    treeData, currItem, formVisible,
  } = permission

  const treeProps = {
    treeData,
    currItem,
    formVisible,
    expandedKeys,
    onKeyChange (key) {
      dispatch({
        type: 'permission/change',
        payload: {
          key,
        },
      })
    },
    showOrHideForm (showOrHide) {
      dispatch({
        type: 'permission/showOrHideForm',
        payload: {
          showOrHide,
        },
      })
    },
    onAdd (isRoot) {
      dispatch({
        type: 'permission/onAdd',
        payload: {
          isRoot,
        },
      })
    },
    onEdit () {
      dispatch({
        type: 'permission/onEdit',
      })
    },
    deleteItem () {
      dispatch({
        type: 'permission/delete',
      })
    },
    onSearch (val) {
      dispatch({
        type: 'permission/onSearch',
        payload: {
          searchValue: val,
        },
      })
    },
    onExpand (keys) {
      dispatch({
        type: 'permission/onExpand',
        payload: {
          expandedKeys: keys,
        },
      })
    },
    onDrop (info) {
      const dropKey = info.node.props.eventKey
      const dragKey = info.dragNode.props.eventKey
      const dropPos = info.node.props.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      dispatch({
        type: 'permission/sort',
        payload: {
          dropKey,
          dragKey,
          dropPosition,
        },
      })
    },
    searchValue,
    autoExpandParent,
    loading: loading.effects['permission/query'],
    location,
  }


  const formProps = {
    currItem,
    treeData,
    loading: loading.effects[`${currItem.id ? 'permission/update' : 'permission/create'}`],
    onOk (data) {
      if (data.id) {
        dispatch({
          type: 'permission/update',
          payload: data,
        })
      } else {
        dispatch({
          type: 'permission/create',
          payload: data,
        })
      }
    },
  }

  return (
    <div className="content-inner">
      <Row>
        <Col span={8}><PermissionTree {...treeProps} /></Col>
        <Col span={12}>
          {formVisible && <PermissionForm {...formProps} />}
        </Col>
      </Row>
    </div>
  )
}

Permission.propTypes = {
  permission: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ permission, loading }) => ({ permission, loading }))(Permission)
