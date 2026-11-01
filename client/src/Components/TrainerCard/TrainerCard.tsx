import type { User } from "../../models/user.model";

interface TrainerCardProps {
  trainer: User;
  onRequest: (trainerId: string) => void;
  loading?: boolean;
}

export function TrainerCard({ trainer, onRequest, loading = false }: TrainerCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {trainer.firstName[0]}{trainer.lastName[0]}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {trainer.firstName} {trainer.lastName}
          </h3>
          <p className="text-sm text-gray-500">{trainer.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
          Trainer
        </span>
        <button
          onClick={() => onRequest(trainer.id)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request
        </button>
      </div>
    </div>
  );
}