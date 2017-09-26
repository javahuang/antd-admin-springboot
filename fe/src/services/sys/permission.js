import { request, config } from '../../utils'

const { api } = config
const { sys } = api
const { permissions } = sys

export default async function query (params) {
  return request({
    url: permissions,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: permissions.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: permissions,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: permissions,
    method: 'patch',
    data: params,
  })
}

export async function sort (params) {
  return request({
    url: `${permissions}/sort`,
    method: 'patch',
    data: params,
  })
}
