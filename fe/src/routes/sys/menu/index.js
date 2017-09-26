import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { connect } from 'dva'
import MenuForm from './Form'
import MenuTree from './Tree'


const Menu = ({ location, dispatch, menu, loading }) => {
  const {
    expandedKeys, searchValue, autoExpandParent,
    treeData, menuPermissionTreeData, currItem, formVisible,
  } = menu

  const treeProps = {
    treeData,
    currItem,
    formVisible,
    expandedKeys,
    onKeyChange (key) {
      dispatch({
        type: 'menu/change',
        payload: {
          key,
        },
      })
    },
    showOrHideForm (showOrHide) {
      dispatch({
        type: 'menu/showOrHideForm',
        payload: {
          showOrHide,
        },
      })
    },
    onAdd (isRoot) {
      dispatch({
        type: 'menu/onAdd',
        payload: {
          isRoot,
        },
      })
    },
    onEdit () {
      dispatch({
        type: 'menu/onEdit',
      })
    },
    deleteItem () {
      dispatch({
        type: 'menu/delete',
      })
    },
    onSearch (val) {
      dispatch({
        type: 'menu/onSearch',
        payload: {
          searchValue: val,
        },
      })
    },
    onExpand (keys) {
      dispatch({
        type: 'menu/onExpand',
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
        type: 'menu/sort',
        payload: {
          dropKey,
          dragKey,
          dropPosition,
        },
      })
    },
    searchValue,
    autoExpandParent,
    loading: loading.effects['menu/query'],
    location,
  }


  const formProps = {
    currItem,
    treeData,
    menuPermissionTreeData,
    loading: loading.effects[`${currItem.id ? 'menu/update' : 'menu/create'}`],
    onOk (data) {
      if (data.id) {
        dispatch({
          type: 'menu/update',
          payload: data,
        })
      } else {
        dispatch({
          type: 'menu/create',
          payload: data,
        })
      }
    },
  }

  return (
    <div className="content-inner">
      <Row>
        <Col span={8}><MenuTree {...treeProps} /></Col>
        <Col span={12}>
          {formVisible && <MenuForm {...formProps} />}
        </Col>
      </Row>
    </div>
  )
}

Menu.propTypes = {
  menu: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ menu, loading }) => ({ menu, loading }))(Menu)
