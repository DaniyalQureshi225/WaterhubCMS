const sessionExpiredListeners = new Set()

export function onSessionExpired(callback) {
  sessionExpiredListeners.add(callback)
  return () => {
    sessionExpiredListeners.delete(callback)
  }
}

export function emitSessionExpired(reason) {
  sessionExpiredListeners.forEach((cb) => {
    try {
      cb(reason)
    } catch (error) {
      // Listener errors must never break the session-expired notification chain
    }
  })
}
