import { request, config } from '../../utils'

const { api } = config
const { sys } = api
const { dataSync, loginLog } = sys

export async function query (params) {
  return request({
    url: dataSync,
    method: 'get',
    data: params,
  })
}

export async function createOrUpdate (params) {
  return request({
    url: dataSync,
    method: 'post',
    data: params,
  })
}

export async function queryLogs (params) {
  return request({
    url: `${dataSync}/:syncId/logs`,
    method: 'get',
    data: params,
  })
}
export async function queryLoginLog (params) {
  return request({
    url: loginLog,
    method: 'get',
    data: params,
  })
}
