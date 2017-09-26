import { parse } from 'qs'
import { queryAutoComplete } from '../../services/common'
import { query, create, remove, update } from '../../services/sys/account'
import queryRole from '../../services/sys/role'

export default {

  namespace: 'account',

  state: {
    list: [],
    currentItem: {},
    roles: [],
    modalVisible: false,
    modalType: 'create',
    isMotion: true,
    loginUser: {},
    nameDataSource: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/sys/account') {
          dispatch({
            type: 'query',
            payload: location.query,
          })

          dispatch({
            type: 'queryRoles',
            payload: {
              pageSize: 1000, // 显示全部的角色
            },
          })

          dispatch({
            type: 'queryUserInfo',
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload }, { call, put }) {
      payload = parse(location.search.substr(1))
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data.message
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data.message
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ account }) => account.currentItem.id)
      const newAccount = { ...payload, id }
      const data = yield call(update, newAccount)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data.message
      }
    },

    * change ({ payload }, { call, put }) {
      const data = yield call(queryAutoComplete, payload)
      if (data) {
        yield put({
          type: 'changeNameDataSource',
          payload: {
            nameDataSource: data.list,
          },
        })
      }
    },

    * queryRoles ({ payload }, { call, put }) {
      const data = yield call(queryRole, payload)
      if (data) {
        yield put({
          type: 'queryRoleTreeSuccess',
          payload: {
            roles: data.list,
          },
        })
      }
    },

    * queryUserInfo (action, { select, put }) {
      const loginUser = yield select(({ app }) => app.user)
      if (loginUser) {
        yield put({
          type: 'queryUserInfoSuccess',
          payload: {
            loginUser,
          },
        })
      }
    },
  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

    changeNameDataSource (state, action) {
      const { nameDataSource } = action.payload
      return {
        ...state,
        nameDataSource,
      }
    },

    queryRoleTreeSuccess (state, action) {
      const { roles } = action.payload
      return {
        ...state,
        roles,
      }
    },

    queryUserInfoSuccess (state, action) {
      const { loginUser } = action.payload
      return {
        ...state,
        loginUser,
      }
    },
  },

}
