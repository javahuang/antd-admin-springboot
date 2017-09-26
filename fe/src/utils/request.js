import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import moment from 'moment'
import { YQL, CORS } from './config'

// 该变量会在编译期间根据当前环境赋值(由 webpack.DefinePlugin 配置)
axios.defaults.baseURL = BASE_URL

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    // http://
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    // 如 url 为 /user/:id，解析为 /user/11
    url = pathToRegexp.compile(url)(data)
    // 解析 url 之后作用去掉 cloneData 里面的对应的解析参数，如上面的 id
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  // 将时间戳和 moment 类型都转化为 yyyy-MM-dd HH:mm:ss 的形式
  // TODO:将时间挫转化为日期/时间并且格式化，对于 2011-11-11 00:00:00 的这种时间格式会误判
  for (let e in cloneData) {
    if (Object.prototype.hasOwnProperty.call(cloneData, e)) {
      let v = cloneData[e]
      if (v instanceof moment) {
        v = v.format('YYYY-MM-DD HH:mm:ss').replace('00:00:00', '').trim()
      } else if ((e.toUpperCase().endsWith('DATE') || e.toUpperCase().endsWith('TIME'))
        && lodash.isNumber(v)) { // 时间挫
        v = moment(v).format('YYYY-MM-DD HH:mm:ss').trim()
      }
      cloneData[e] = v
    }
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${qs.stringify(options.data)}'&format=json`
    data = null
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, qs.stringify(cloneData, { indices: false }))
    case 'put':
      return axios.put(url, qs.stringify(cloneData, { indices: false }))
    case 'patch':
      return axios.patch(url, qs.stringify(cloneData, { indices: false }))
    default:
      return axios(options)
  }
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    const { response } = error
    let msg
    let status
    let otherData = {}
    if (response) {
      const { data, statusText } = response
      otherData = data
      status = response.status
      msg = data.message || statusText
    } else {
      status = 600
      msg = 'Network Error'
    }
    // 如果没有认证，跳转到首页
    if (status === 401) {
      let from = window.location.pathname
      window.location = `${location.origin}/login?from=${from}`
    }
    return { success: false, status, message: msg, ...otherData }
  })
}
