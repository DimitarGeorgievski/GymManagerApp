import { CalendarDays, Clock, FileText } from "lucide-react";
import type { Plan } from "../../models/plan.model";

interface PlanCardProps {
  plan: Plan;
}
export function PlanCard({ plan }: PlanCardProps) {
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const duration = Math.max(
    0,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  return (
    <div className="bg-white rounded-2xl border hover:shadow-xl transition hover:scale-[1.01] ease-in cursor-pointer p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={18} className="text-gray-600 shrink-0" />
          <h2 className="text-lg font-bold text-gray-800 wrap-break-word">
            {plan.title}
          </h2>
        </div>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {new Date(plan.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
        {plan.description}
      </p>
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays size={16} className="shrink-0" />
          <div>
            <p className="text-gray-400 text-xs">Start date</p>
            <span className="font-semibold text-gray-800">
              {startDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays size={16} className="shrink-0" />
          <div>
            <p className="text-gray-400 text-xs">End date</p>
            <span className="font-semibold text-gray-800">
              {endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600 col-span-2">
          <Clock size={16} className="shrink-0" />
          <span>
            Duration:{" "}
            <span className="font-semibold text-gray-800">{duration} days</span>
          </span>
        </div>
      </div>
    </div>
  );
}
