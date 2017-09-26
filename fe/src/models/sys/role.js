import { parse } from 'qs'
import query, { create, remove, update } from '../../services/sys/role'
import queryPermission from '../../services/sys/permission'
import { queryAutoComplete } from '../../services/common'

export default {

  namespace: 'role',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    isMotion: true,
    nameDataSource: [],
    permissionTreeData: [],
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
        if (location.pathname === '/sys/role') {
          dispatch({
            type: 'query',
            payload: location.query,
          })

          dispatch({
            type: 'queryPermissionTree',
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
      const id = yield select(({ role }) => role.currentItem.id)
      const newRole = { ...payload, id }
      const data = yield call(update, newRole)
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

    * queryPermissionTree (action, { call, put }) {
      const data = yield call(queryPermission)
      if (data) {
        yield put({
          type: 'queryPermissionTreeSuccess',
          payload: {
            permissionTreeData: data.array,
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
    queryPermissionTreeSuccess (state, action) {
      const { permissionTreeData } = action.payload
      return {
        ...state,
        permissionTreeData,
      }
    },
  },

}
