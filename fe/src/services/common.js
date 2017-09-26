/**
 * Created by huangrupeng on 17/5/24.
 */
import { request, config } from '../utils'


const { api } = config
const { common } = api
const { autoComplete, select } = common

export async function queryAutoComplete (params) {
  return request({
    url: autoComplete,
    method: 'get',
    data: params,
  })
}

export async function querySelect (params) {
  return request({
    url: select,
    method: 'get',
    data: params,
  })
}

