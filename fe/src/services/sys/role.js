import { request, config } from '../../utils'

const { api } = config
const { sys } = api
const { roles, permissions } = sys

export default async function query (params) {
  return request({
    url: roles,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: roles.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: roles,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: roles,
    method: 'patch',
    data: params,
  })
}

export async function queryPermissions (params) {
  return request({
    url: permissions,
    method: 'get',
    data: params,
  })
}
