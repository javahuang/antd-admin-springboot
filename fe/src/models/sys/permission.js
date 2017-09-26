import { message } from 'antd'
import { parse } from 'qs'
import { default as query, create, remove, update, sort } from '../../services/sys/permission'

export default {

  namespace: 'permission',

  state: {
    treeData: [],
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true, // 如果为true，必须先折叠子节点才能折叠父节点
    currItem: {},
    latestItemId: '', // 最近被点击的节点id
    formVisible: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/sys/permission') {
          dispatch({
            type: 'query',
            payload: location.query,
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
            treeData: data.array,
          },
        })
      }
    },

    * delete (action, { call, put, select }) {
      const id = yield select(({ permission }) => permission.latestItemId)
      const data = yield call(remove, { id })
      if (data.success) {
        message.success('节点删除成功')
        yield put({ type: 'query' })
      } else {
        throw data.message
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'query' })
        yield put({
          type: 'showOrHideForm',
          payload: {
            showOrHide: false,
          },
        })
        message.success('添加成功')
      } else {
        throw data.message
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ permission }) => permission.currItem.id)
      const newAccount = { ...payload, id }
      const data = yield call(update, newAccount)
      if (data.success) {
        yield put({ type: 'query' })
        message.success('修改成功')
      } else {
        throw data.message
      }
    },
    * sort ({ payload }, { select, call, put }) {
      const { dropKey, dragKey, dropPosition } = payload
      const treeData = yield select(({ permission }) => permission.treeData)
      const dropItem = treeData.filter(el => el.id === dragKey)[0]
      const dragItem = treeData.filter(el => el.id === dropKey)[0]
      if (dropItem.parentId !== dragItem.parentId || dropPosition === 0) {
        message.error('只能在同一级移动调换顺序')
      } else if (dropItem === dragItem) {
        message.error('顺序未发生变化')
      } else {
        const data = yield call(sort, payload)
        if (data.success) {
          yield put({ type: 'query' })
          yield put({
            type: 'showOrHideForm',
            payload: {
              showOrHide: false,
            },
          })
          message.success('更新成功')
        } else {
          throw data.message
        }
      }
    },
  },

  reducers: {

    querySuccess (state, action) {
      const { treeData } = action.payload
      return {
        ...state,
        treeData,
      }
    },
    change (state, action) {
      const { key } = action.payload
      const { latestItemId } = state
      let currItem = {}
      // 选中
      if (key) {
        currItem = state.treeData.filter(el => el.id === key)[0]
      }
      return {
        ...state,
        currItem,
        latestItemId: key || latestItemId,
      }
    },
    onAdd (state, action) {
      const { isRoot } = action.payload
      const { latestItemId } = state
      let currItem = { parentId: isRoot ? null : latestItemId }
      return {
        ...state,
        currItem,
        formVisible: true,
      }
    },
    onSearch (state, action) {
      const { searchValue } = action.payload
      const { treeData } = state
      const expandedKeys = treeData.map((item) => {
        if (item.name.indexOf(searchValue) > -1) {
          return item.parentId
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
        .map((item) => {
          return `${item}`
        })
      return {
        ...state,
        searchValue,
        expandedKeys,
        autoExpandParent: true,
      }
    },
    onEdit (state) {
      const { latestItemId, treeData } = state
      const currItem = treeData.filter(el => el.id === latestItemId)[0]
      return {
        ...state,
        currItem,
        formVisible: true,
      }
    },
    onExpand (state, action) {
      let { expandedKeys } = action.payload
      return {
        ...state,
        autoExpandParent: false,
        expandedKeys,
      }
    },
    showOrHideForm (state, action) {
      const { showOrHide } = action.payload
      return {
        ...state,
        formVisible: showOrHide,
      }
    },
  },

}
