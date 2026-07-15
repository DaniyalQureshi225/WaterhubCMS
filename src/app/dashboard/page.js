'use client'

import { ChevronRight, TrendingUp, Users } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import SummaryCards from '@/components/dashboard/SummaryCards'
import RevenueLineChart from '@/components/charts/RevenueLineChart'
import RevenueDonutChart from '@/components/charts/RevenueDonutChart'
import SubscriptionPieChart from '@/components/charts/SubscriptionPieChart'
import UserGrowthBarChart from '@/components/charts/UserGrowthBarChart'
import TopSellersTable from '@/components/dashboard/TopSellersTable'
import RecentSubscriptions from '@/components/dashboard/RecentSubscriptions'
import { useDashboard } from '@/hooks/useDashboard'
import RecentActivity from '@/components/dashboard/RecentActivity'

export default function DashboardPage() {
  const { data: res, isLoading, error } = useDashboard()
  const dashboard = res?.data || {}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-600">Failed to load dashboard data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <span className="text-slate-900 font-medium">Dashboard</span>
          <ChevronRight size={14} />
          <span>Overview</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here is an overview of your platform today.</p>
      </div>

      <SummaryCards data={dashboard} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Monthly Revenue</h3>
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> +12.5%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueLineChart data={dashboard.charts?.monthlyRevenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Revenue Sources</h3>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">This Year</span>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueDonutChart data={dashboard.charts?.revenueDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Subscription Distribution</h3>
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">Active Plans</span>
            </div>
          </CardHeader>
          <CardContent>
            <SubscriptionPieChart data={dashboard.charts?.subscriptionDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">User Growth</h3>
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Users size={12} /> +4.8%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <UserGrowthBarChart
              sellerGrowth={dashboard.charts?.monthlySellerGrowth}
              customerGrowth={dashboard.charts?.monthlyCustomerGrowth}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Top Sellers</h3>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TopSellersTable sellers={dashboard.topSellers} />
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
            <RecentActivity activities={dashboard.recentActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
