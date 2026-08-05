'use client'

import { useMemo } from 'react'

function safeDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function daysBetween(start, end) {
  if (!start || !end) return 0
  const diff = end.getTime() - start.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function fmtCurrency(amount) {
  return `Rs. ${(amount || 0).toLocaleString()}`
}

export function useSubscriptionAnalytics(subscriptions = [], trialUsers = [], plans = []) {
  const analytics = useMemo(() => {
    const now = new Date()
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const activeSubs = subscriptions.filter(s => s.status === 'active')
    const expiredSubs = subscriptions.filter(s => s.status === 'expired')
    const allTrialSubs = trialUsers
    const activeTrials = trialUsers.filter(t => t.status !== 'expired')
    const expiredTrials = trialUsers.filter(t => t.status === 'expired')

    const monthlySubs = activeSubs.filter(s => s.plan === 'MONTHLY')
    const annualSubs = activeSubs.filter(s => s.plan === 'ANNUAL')

    const monthlyRevenue = monthlySubs.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
    const annualRevenue = annualSubs.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
    const totalRevenue = monthlyRevenue + annualRevenue

    const paidUsers = activeSubs.length
    const totalTrialUsers = allTrialSubs.length
    const trialConversionRate = totalTrialUsers > 0
      ? ((paidUsers / (paidUsers + totalTrialUsers)) * 100).toFixed(1)
      : null

    const expiringSoon = activeSubs.filter(s => {
      const endDate = safeDate(s.expiryDate)
      return endDate && endDate > now && endDate <= next7Days
    }).length

    const upcomingRenewals = activeSubs.filter(s => {
      const endDate = safeDate(s.expiryDate)
      return endDate && endDate > now && endDate <= next7Days
    }).length

    const upcomingExpirations = expiringSoon

    const averageSubscriptionDuration = (() => {
      const completedSubs = [...activeSubs, ...expiredSubs].filter(s => s.startDate && s.expiryDate)
      if (completedSubs.length === 0) return 0
      const totalDays = completedSubs.reduce((sum, s) => {
        const start = safeDate(s.startDate)
        const end = safeDate(s.expiryDate)
        return sum + daysBetween(start, end)
      }, 0)
      return Math.round(totalDays / completedSubs.length)
    })()

    const averageRevenuePerSubscriber = paidUsers > 0
      ? Math.round(totalRevenue / paidUsers)
      : 0

    const trialDuration = (() => {
      const trialPlan = plans.find(p => p.durationType === 'TRIAL' || p.name?.toLowerCase().includes('trial'))
      if (trialPlan?.duration) return `${trialPlan.duration} ${trialPlan.durationType || 'Days'}`
      const firstTrial = allTrialSubs[0]
      if (firstTrial?.startDate && firstTrial?.expiryDate) {
        const start = safeDate(firstTrial.startDate)
        const end = safeDate(firstTrial.expiryDate)
        if (start && end) return `${daysBetween(start, end)} Days`
      }
      return '7 Days'
    })()

    const renewalCycles = [...new Set(plans.map(p => p.durationType).filter(Boolean))]
    const activePlans = plans.filter(p => p.status?.toLowerCase() !== 'inactive').length

    return {
      totalActiveSubscriptions: activeSubs.length,
      trialUsers: activeTrials.length,
      paidUsers,
      monthlySubscribers: monthlySubs.length,
      annualSubscribers: annualSubs.length,
      expiredSubscriptions: expiredSubs.length + expiredTrials.length,
      expiringSoon,
      monthlyRevenue,
      annualRevenue,
      totalRevenue,
      trialConversionRate: trialConversionRate ? `${trialConversionRate}%` : null,
      trialDuration,
      renewalCycles,
      activePlans,
      averageSubscriptionDuration,
      averageRevenuePerSubscriber,
      upcomingRenewals,
      upcomingExpirations,
      totalSubscriptions: subscriptions.length,
      totalTrialUsers,
    }
  }, [subscriptions, trialUsers, plans])

  return analytics
}

export function useSubscriptionActivity(subscriptions = [], trialUsers = []) {
  const activities = useMemo(() => {
    const acts = []
    const now = new Date()

    subscriptions.forEach(s => {
      if (!s.id) return
      const endDate = safeDate(s.expiryDate)
      const startDate = safeDate(s.startDate)
      const createdDate = safeDate(s.requestedOn)

      if (s.status === 'expired' && endDate) {
        acts.push({
          type: 'expire',
          action: `${s.sellerName || 'A seller'}'s subscription expired`,
          seller: s.sellerName || 'Unknown',
          plan: s.plan,
          time: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: endDate.getTime(),
        })
      }

      if (s.status === 'active' && startDate) {
        const isNew = createdDate && (now.getTime() - createdDate.getTime()) < 30 * 24 * 60 * 60 * 1000
        if (isNew) {
          acts.push({
            type: 'purchase',
            action: `${s.sellerName || 'A seller'} purchased ${s.plan} Plan`,
            seller: s.sellerName || 'Unknown',
            plan: s.plan,
            time: createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: createdDate.getTime(),
          })
        } else if (endDate && endDate > now && daysBetween(now, endDate) <= 7) {
          acts.push({
            type: 'renew',
            action: `${s.sellerName || 'A seller'} renewed ${s.plan} Plan`,
            seller: s.sellerName || 'Unknown',
            plan: s.plan,
            time: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: startDate.getTime(),
          })
        }
      }
    })

    trialUsers.forEach(t => {
      if (!t.id) return
      const startDate = safeDate(t.startDate)
      const endDate = safeDate(t.expiryDate)
      const createdDate = safeDate(t.requestedOn)

      if (t.status === 'expired' && endDate) {
        acts.push({
          type: 'expire',
          action: `${t.sellerName || 'A seller'}'s trial expired`,
          seller: t.sellerName || 'Unknown',
          plan: 'Trial',
          time: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: endDate.getTime(),
        })
      }

      if (t.status !== 'expired' && startDate && createdDate) {
        const isNew = (now.getTime() - createdDate.getTime()) < 30 * 24 * 60 * 60 * 1000
        if (isNew) {
          acts.push({
            type: 'trial',
            action: `${t.sellerName || 'A seller'} started Trial`,
            seller: t.sellerName || 'Unknown',
            plan: 'Trial',
            time: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: createdDate.getTime(),
          })
        }
      }
    })

    return acts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
  }, [subscriptions, trialUsers])

  return activities
}