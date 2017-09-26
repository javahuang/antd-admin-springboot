import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Account = ({ location, dispatch, account, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, nameDataSource, roles, loginUser } = account
  const { pageSize } = pagination

  const modalProps = {
    roles,
    loginUser,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`${modalType === 'create' ? 'account/create' : 'account/update'}`],
    title: `${modalType === 'create' ? '添加账户' : '修改账户'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `account/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'account/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['account/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'account/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'account/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const filterProps = {
    nameDataSource,
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/user',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/user',
      }))
    },
    onAdd () {
      dispatch({
        type: 'account/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    changeNameDataSource (val) {
      dispatch({
        type: 'account/change',
        payload: {
          q: val, // 查询字符串
          s: 'ac1', // 查询标识
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'user/switchIsMotion' })
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

Account.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  account: PropTypes.object,
}

export default connect(({ account, loading }) => ({ account, loading }))(Account)
