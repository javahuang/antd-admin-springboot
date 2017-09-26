import { request } from '../utils'

export async function query (params) {
  params.key = 'i7sau1babuzwhycn'
  return request({
    url: '/weather/now.json',
    method: 'get',
    data: params,
  })
}
