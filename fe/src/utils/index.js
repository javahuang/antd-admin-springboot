import classnames from 'classnames'
import lodash from 'lodash'
import moment from 'moment'
import { color } from './theme'
import config from './config'
import request from './request'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 判断两个对象是否相等
 * @param src
 * @param dest
 */
const isEqual = (src, dest) => {
  // 对象为 null/undefined/'' 时都是相等的
  if (lodash.isEmpty(src) && lodash.isEmpty(dest)) {
    return true
  }
  let srcValue = src
  let destValue = dest
  // 时间戳比较
  if (src instanceof moment) {
    srcValue = src.valueOf()
  }
  if (dest instanceof moment) {
    destValue = dest.valueOf()
  }
  // 如果其中一方为数组，也相等
  if (src instanceof Array && src.length === 1 && !(dest instanceof Array)) {
    return src[0] === dest
  } else if (src instanceof Array && (dest instanceof Array)
    && dest.length === 1 && src.length === 1) {
    return src[0] === dest[0]
  } else if (!(src instanceof Array) && (dest instanceof Array) && dest.length === 1) {
    return src === dest[0]
  }
  return srcValue === destValue
}


/**
 * lodash 的 isEmpty 会将单独的值判定为 false
 * @param obj
 * @returns {boolean}
 */
const isEmpty = (obj) => {
  if (!obj) {
    return true
  }
  return lodash.isEmpty(obj)
}

module.exports = {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  isEqual,
  isEmpty,
}
