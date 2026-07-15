'use client'

import { CheckCircle, XCircle, Clock, CreditCard, RotateCcw, UserPlus } from 'lucide-react'

const iconMap = {
  approve: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  reject: { icon: XCircle, color: 'text-red-600 bg-red-50' },
  expire: { icon: Clock, color: 'text-amber-600 bg-amber-50' },
  purchase: { icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
  renew: { icon: RotateCcw, color: 'text-indigo-600 bg-indigo-50' },
  trial: { icon: UserPlus, color: 'text-violet-600 bg-violet-50' },
}

export default function RecentActivityTimeline({ activities }) {
  return (
    <div className="space-y-0">
      {activities.map((activity, idx) => {
        const style = iconMap[activity.type] || iconMap.approve
        return (
          <div key={idx} className="flex gap-3.5 px-5 py-3.5 last:pb-4">
            <div className="relative flex flex-col items-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.color}`}>
                <style.icon size={15} />
              </div>
              {idx < activities.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1.5" />}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-medium text-slate-900">{activity.action}</p>
              <p className="text-xs text-slate-500">
                {activity.seller}{activity.plan ? ` — ${activity.plan}` : ''}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
