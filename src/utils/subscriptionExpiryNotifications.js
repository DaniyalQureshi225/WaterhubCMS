import { createNotification } from '@/services/notification.service'

function daysBetween(a, b) {
  return Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24))
}

function toISOString(date) {
  return new Date(date).toISOString()
}

export async function scheduleSubscriptionExpiryNotifications(subscription) {
  const sellerId = subscription.seller?._id || subscription.seller
  const endDate = subscription.endDate

  if (!sellerId || !endDate) return

  const now = new Date()
  const expiry = new Date(endDate)
  const daysUntilExpiry = daysBetween(now, expiry)

  const notifications = []

  if (daysUntilExpiry > 10) {
    const tenDayBefore = new Date(expiry)
    tenDayBefore.setDate(tenDayBefore.getDate() - 10)
    tenDayBefore.setHours(9, 0, 0, 0)

    if (tenDayBefore > now) {
      notifications.push({
        title: 'Subscription Expiring Soon',
        message: 'Your subscription will expire in 10 days. Please renew to avoid service interruption.',
        audience: 'SPECIFIC_USER',
        targetUser: sellerId,
        scheduleAt: toISOString(tenDayBefore),
      })
    }
  }

  if (daysUntilExpiry > 3) {
    const threeDayBefore = new Date(expiry)
    threeDayBefore.setDate(threeDayBefore.getDate() - 3)
    threeDayBefore.setHours(9, 0, 0, 0)

    if (threeDayBefore > now) {
      notifications.push({
        title: 'Subscription Expiring in 3 Days',
        message: 'Your subscription expires in 3 days. Renew now to continue using the Seller App without interruption.',
        audience: 'SPECIFIC_USER',
        targetUser: sellerId,
        scheduleAt: toISOString(threeDayBefore),
      })
    }
  }

  for (const notif of notifications) {
    try {
      const fd = new FormData()
      fd.append('title', notif.title)
      fd.append('message', notif.message)
      fd.append('audience', notif.audience)
      fd.append('targetUser', notif.targetUser)
      fd.append('scheduleAt', notif.scheduleAt)
      await createNotification(fd)
    } catch {
      // silent fail for auto-scheduled notifications
    }
  }
}
