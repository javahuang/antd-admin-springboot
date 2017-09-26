import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Input, Popover, Button, Icon, Popconfirm } from 'antd'
import arrToTree from 'array-to-tree'


const TreeNode = Tree.TreeNode
const Search = Input.Search


const MenuTree = ({
  autoExpandParent, expandedKeys, onExpand, onDrop, showOrHideForm, searchValue, onKeyChange,
  onAdd, onEdit, onSearch, deleteItem, treeData,
}) => {
  const onSelect = (selectKeys) => {
    let currKey = selectKeys[0]
    onKeyChange(currKey)
  }

  // 如果操作框打开，则隐藏form
  const onVisibleChange = (visible) => {
    if (visible) {
      showOrHideForm(false)
    }
  }

  const content = (item) => {
    return (
      <div>
        <p>
          <Button type="default" size="small" onClick={() => { onAdd(false) }}>添加</Button>
        </p>
        <p>
          <Button type="default" size="small" onClick={onEdit}>修改</Button>
        </p>
        <p>
          <Popconfirm title="是否确定删除当前节点?" onConfirm={deleteItem} okText="是" cancelText="否">
            <Button type="danger" size="small">删除</Button>
          </Popconfirm>
        </p>
        <p hidden={!!item.mpid}>
          <Button type="primary" size="small" onClick={() => { onAdd(true) }}>添加一级菜单</Button>
        </p>
      </div>
    )
  }

  const searchPermission = (e) => {
    const value = e.target.value
    onSearch(value)
  }

  const loop = data => data.map((item) => {
    const index = item.name.search(searchValue)
    const beforeStr = item.name.substr(0, index)
    const afterStr = item.name.substr(index + searchValue.length)
    const title = index > -1 ? (
      <span>
        <Icon type={item.icon} />
        <Popover content={content(item)} placement="right" trigger="click" onVisibleChange={onVisibleChange}>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </Popover>
      </span>
    ) : <span>{item.name}</span>
    if (item.children) {
      return (
        <TreeNode key={item.id} title={title}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode key={item.id} title={title} />
  })


  return (
    <div>
      <Search style={{ width: 300 }} placeholder="Search" onChange={searchPermission} />
      <Tree
        showLine
        draggable
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onDrop={onDrop}
      >
        {loop(arrToTree(treeData, { parentProperty: 'mpid', rootID: 1 }))}
      </Tree>
    </div>
  )
}

MenuTree.propTypes = {
  autoExpandParent: PropTypes.any,
  expandedKeys: PropTypes.any,
  onExpand: PropTypes.any,
  onDrop: PropTypes.any,
  showOrHideForm: PropTypes.any,
  searchValue: PropTypes.any,
  onKeyChange: PropTypes.any,
  onAdd: PropTypes.any,
  onEdit: PropTypes.any,
  onSearch: PropTypes.any,
  deleteItem: PropTypes.any,
  treeData: PropTypes.any,
}

export default MenuTree
