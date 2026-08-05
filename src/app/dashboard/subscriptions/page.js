'use client'

import { useState, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Settings, ChevronRight, TrendingUp, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import SubStatsCards from '@/components/subscriptions/SubStatsCards'
import SubFilterBar from '@/components/subscriptions/SubFilterBar'
import SubPlans from '@/components/subscriptions/SubPlans'
import PendingApprovalsTable from '@/components/subscriptions/PendingApprovalsTable'
import AllSubscriptionsTable from '@/components/subscriptions/AllSubscriptionsTable'
import TrialUsersTable from '@/components/subscriptions/TrialUsersTable'
import ApprovalDrawer from '@/components/subscriptions/ApprovalDrawer'
import SubDetailsDrawer from '@/components/subscriptions/SubDetailsDrawer'
import RenewModal from '@/components/subscriptions/RenewModal'
import SubscriptionCharts from '@/components/subscriptions/SubscriptionCharts'
import BusinessRules from '@/components/subscriptions/BusinessRules'
import RecentActivityTimeline from '@/components/subscriptions/RecentActivityTimeline'
import PlanFormDrawer from '@/components/subscriptions/PlanFormDrawer'
import TrialSettingsModal from '@/components/subscriptions/TrialSettingsModal'
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions'
import { useAdminPlans } from '@/hooks/useAdminPlans'
import { useSubscriptionAnalytics } from '@/hooks/useSubscriptionAnalytics'
import { approveSubscription, rejectSubscription, createPlan, updatePlan, deletePlan, getSubscriptionById } from '@/services/subscription.service'
import { buildPlanPayload } from '@/api/payloads'
import { scheduleSubscriptionExpiryNotifications } from '@/utils/subscriptionExpiryNotifications'

export default function SubscriptionsPage() {
  const [filters, setFilters] = useState({ search: '', status: '', type: '', plan: '', dateFrom: '', dateTo: '' })
  const [page, setPage] = useState(1)
  const [viewingApproval, setViewingApproval] = useState(null)
  const [viewingSub, setViewingSub] = useState(null)
  const [renewTarget, setRenewTarget] = useState(null)
  const [showRenew, setShowRenew] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const apiParams = useMemo(() => ({
    page,
    limit: 10,
    search: filters.search || undefined,
    status: filters.status || undefined,
    type: filters.type || undefined,
    plan: filters.plan || undefined,
  }), [page, filters])

  const { data, isLoading, isError } = useAdminSubscriptions(apiParams)
  const { data: plansData, isLoading: plansLoading } = useAdminPlans()
  const queryClient = useQueryClient()
  const plans = plansData || []

  const approveMutation = useMutation({
    mutationFn: (sub) => approveSubscription(sub.id),
    onSuccess: (_, sub) => {
      toast.success('Subscription approved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] })
      if (sub.endDate) {
        scheduleSubscriptionExpiryNotifications(sub)
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to approve subscription')
    },
  })

  const createPlanMutation = useMutation({
    mutationFn: ({ form, features }) => createPlan(buildPlanPayload({ ...form, features })),
    onSuccess: () => {
      toast.success('Subscription plan created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
      setShowPlanForm(false)
      setEditingPlan(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create plan')
    },
  })

  const updatePlanMutation = useMutation({
    mutationFn: ({ form, features, editPlan }) =>
      updatePlan({ id: editPlan.id, ...buildPlanPayload({ ...form, features }) }),
    onSuccess: () => {
      toast.success('Subscription plan updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
      setShowPlanForm(false)
      setEditingPlan(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update plan')
    },
  })

  const deletePlanMutation = useMutation({
    mutationFn: (id) => deletePlan(id),
    onSuccess: () => {
      toast.success('Subscription plan deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete plan')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectSubscription(id, reason),
    onSuccess: () => {
      toast.success('Subscription rejected')
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to reject subscription')
    },
  })

  const { data: approvalDetails, isLoading: approvalLoading } = useQuery({
    queryKey: ['subscription', viewingApproval?.id],
    queryFn: () => getSubscriptionById(viewingApproval.id),
    enabled: !!viewingApproval,
    select: (res) => {
      const d = res.data || {}
      const seller = d.seller || {}
      const fmtDate = (iso) => iso ? iso.split('T')[0] : 'N/A'
      return {
        id: d._id,
        sellerName: seller.shopName || seller.ownerName || 'N/A',
        shopName: seller.shopName || 'N/A',
        phone: seller.phone || d.phone || 'N/A',
        email: seller.email || '',
        plan: d.planId?.name || d.plan || '',
        type: d.type || '',
        status: (d.status || '').toLowerCase(),
        startDate: fmtDate(d.startDate),
        expiryDate: fmtDate(d.endDate),
        endDate: d.endDate,
        seller: d.seller,
        amount: d.amount || 0,
        paymentScreenshot: d.paymentScreenshot || null,
        paymentDate: fmtDate(d.startDate),
        requestedOn: fmtDate(d.createdAt),
        paymentRef: '',
      }
    },
  })

  const subscriptions = useMemo(() => data?.subscriptions || [], [data])
  const pendingApprovals = useMemo(() => data?.pendingApprovals || [], [data])
  const trialUsers = useMemo(() => data?.trialUsers || [], [data])
  const meta = data?.meta || {}

  const analytics = useSubscriptionAnalytics(subscriptions, trialUsers, plans)

  const stats = useMemo(() => ({
    activeSubscriptions: analytics.totalActiveSubscriptions,
    trialUsers: analytics.trialUsers,
    expiredSubscriptions: analytics.expiredSubscriptions,
    pendingApprovals: pendingApprovals.length,
    monthlySubscribers: analytics.monthlySubscribers,
    annualSubscribers: analytics.annualSubscribers,
    monthlyRevenue: analytics.monthlyRevenue,
    annualRevenue: analytics.annualRevenue,
    totalRevenue: analytics.totalRevenue,
    expiringSoon: analytics.expiringSoon,
    paidUsers: analytics.paidUsers,
    trialConversionRate: analytics.trialConversionRate,
  }), [analytics, pendingApprovals])

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  function handleReset() {
    setFilters({ search: '', status: '', type: '', plan: '', dateFrom: '', dateTo: '' })
    setPage(1)
  }

  function handleApprove(approval) {
    approveMutation.mutate(approval)
  }

  function handleReject(approval, reason) {
    rejectMutation.mutate({ id: approval.id, reason })
  }

  function handleRenew(data) {
    alert(`Subscription renewed with ${data.plan} plan`)
    setShowRenew(false)
    setRenewTarget(null)
  }

  function handleOpenCreate() {
    setEditingPlan(null)
    setShowPlanForm(true)
  }

  function handleOpenEdit(plan) {
    setEditingPlan(plan)
    setShowPlanForm(true)
  }

  function handleDeletePlan(plan) {
    if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      deletePlanMutation.mutate(plan.id)
    }
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Subscriptions</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Manage Subscriptions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage seller subscriptions, trial users, payment approvals and subscription plans.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
          >
            <Plus size={16} />
            Create Subscription Plan
          </button>
          <button onClick={() => setShowSettings(true)} className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-sm text-red-600">Failed to load subscriptions data.</p>
        </div>
      ) : (
        <>
          <SubStatsCards stats={stats} />

          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-900">Subscription Plans</h3>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full" />
                </div>
              ) : (
                <SubPlans plans={plans} onEdit={handleOpenEdit} onDelete={handleDeletePlan} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Pending Approvals</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pendingApprovals.length} payments awaiting review</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  <RefreshCw size={12} /> {pendingApprovals.length} Pending
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <PendingApprovalsTable
                approvals={pendingApprovals}
                onView={setViewingApproval}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Trial Users</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{trialUsers.filter(t => t.status !== 'expired').length} active trials</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  <TrendingUp size={12} /> {trialUsers.filter(t => t.status !== 'expired').length} Active
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TrialUsersTable
                trials={trialUsers}
                onView={() => {}}
                onConvert={() => alert('Convert to paid subscription')}
                onExpire={() => alert('Trial expired')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-900">All Subscriptions</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-5 pt-4 pb-0">
                <SubFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
              </div>
              <div className="mt-4">
                <AllSubscriptionsTable
                  subscriptions={subscriptions}
                  meta={meta}
                  page={page}
                  onPageChange={setPage}
                  onView={setViewingSub}
                />
              </div>
            </CardContent>
          </Card>

          <BusinessRules subscriptions={subscriptions} trialUsers={trialUsers} plans={plans} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-base font-semibold text-slate-900">Analytics</h3>
              </CardHeader>
              <CardContent>
                <SubscriptionCharts subscriptions={subscriptions} plans={plans} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <RecentActivityTimeline subscriptions={subscriptions} trialUsers={trialUsers} />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <ApprovalDrawer
        approval={approvalDetails || viewingApproval}
        isOpen={!!viewingApproval}
        isLoading={approvalLoading}
        onClose={() => setViewingApproval(null)}
        onApprove={(a) => { handleApprove(a); setViewingApproval(null) }}
        onReject={(a, r) => { handleReject(a, r); setViewingApproval(null) }}
      />

      <SubDetailsDrawer
        sub={viewingSub}
        isOpen={!!viewingSub}
        onClose={() => setViewingSub(null)}
        onRenew={(sub) => { setRenewTarget(sub); setShowRenew(true) }}
      />

      <RenewModal
        isOpen={showRenew}
        onClose={() => { setShowRenew(false); setRenewTarget(null) }}
        onRenew={handleRenew}
      />

      <PlanFormDrawer
        isOpen={showPlanForm}
        onClose={() => { setShowPlanForm(false); setEditingPlan(null) }}
        mutation={editingPlan ? updatePlanMutation : createPlanMutation}
        editPlan={editingPlan}
      />

      <TrialSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}
