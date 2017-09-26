import { request, config } from '../../utils'

const { api } = config
const { sys } = api
const { accounts } = sys

export async function query (params) {
  return request({
    url: accounts,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: accounts.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: accounts,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: accounts,
    method: 'patch',
    data: params,
  })
}
