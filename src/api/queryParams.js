export function buildQueryString(params = {}) {
  const query = new URLSearchParams()

  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.sort) query.set('sort', params.sort)
  if (params.order) query.set('order', params.order)
  if (params.status) query.set('status', params.status)
  if (params.startDate) query.set('startDate', params.startDate)
  if (params.endDate) query.set('endDate', params.endDate)
  if (params.target) query.set('target', params.target)
  if (params.plan) query.set('plan', params.plan)
  if (params.type) query.set('type', params.type)
  if (params.city) query.set('city', params.city)

  const str = query.toString()
  return str ? `?${str}` : ''
}
