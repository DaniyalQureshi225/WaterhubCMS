"use client";

import { Check, Edit3, Trash2, Info } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function SubPlans({ plans, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          Every new phone number receives a{" "}
          <strong>one-time 7-day free trial</strong>. Trial starts immediately
          after seller registration and cannot be restarted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {plan.name}
                </h3>
                <Badge
                  variant={plan.status === "active" ? "active" : "inactive"}
                >
                  {plan.status}
                </Badge>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-slate-900">
                  Rs. {plan.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500">
                  /{plan.durationType?.toLowerCase()}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-3 mb-4">
                {plan.description}
              </p>
              <div className="space-y-2">
                {plan.features?.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-slate-700"
                  >
                    <Check
                      size={15}
                      className="text-emerald-500 flex-shrink-0"
                    />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onEdit(plan)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit3 size={15} />
                Edit Plan
              </button>
              <button
                onClick={() => onDelete(plan)}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
