export function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  return baseUrl.replace(/\/api\/v1$/, '')
}

export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = getApiBaseUrl()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}