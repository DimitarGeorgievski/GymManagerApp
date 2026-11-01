import { CheckCircle, XCircle } from "lucide-react";
import type { TrainerSwitchRequest } from "../../models/user.model";

interface PendingRequestCardProps {
  request: TrainerSwitchRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  loading?: boolean;
}

export function PendingRequestCard({ request, onApprove, onReject, loading = false }: PendingRequestCardProps) {
  return (
    <div key={request.id} className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {request.user.firstName[0]}{request.user.lastName[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {request.user.firstName} {request.user.lastName}
            </h3>
            <p className="text-sm text-gray-500">{request.user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Requested {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(request.id)}
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            onClick={() => onReject(request.id)}
            disabled={loading}
            className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}