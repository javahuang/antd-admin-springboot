import { request, config } from '../../utils'

const { api } = config
const { sys } = api
const { schedule } = sys

export async function query (params) {
  return request({
    url: schedule,
    method: 'get',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: schedule,
    method: 'post',
    data: params,
  })
}
