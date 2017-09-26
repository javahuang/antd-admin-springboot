import { request, config } from '../../utils'

const { api } = config
const { sys } = api
const { menus } = sys

export async function query (params) {
  return request({
    url: menus,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: menus.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: menus,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: menus,
    method: 'patch',
    data: params,
  })
}

export async function sort (params) {
  return request({
    url: `${menus}/sort`,
    method: 'patch',
    data: params,
  })
}

