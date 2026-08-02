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
  if (params.sellerId) query.set('sellerId', params.sellerId)
  if (params.sellerName) query.set('sellerName', params.sellerName)
  if (params.company) query.set('company', params.company)
  if (params.severity) query.set('severity', params.severity)
  if (params.appVersion) query.set('appVersion', params.appVersion)
  if (params.deviceModel) query.set('deviceModel', params.deviceModel)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)

  const str = query.toString()
  return str ? `?${str}` : ''
}
