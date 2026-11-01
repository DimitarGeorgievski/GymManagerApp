import { useEffect } from "react";
import { useTrainerStore } from "../../store/useTrainerStore";
import { useUserStore } from "../../store/useUserStore";
import { Mail, Dumbbell, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

document.title = "My Trainer";
export function MyTrainer() {
  const { myTrainer, fetchMyTrainer, loading, error } = useTrainerStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchMyTrainer();
  }, [fetchMyTrainer]);
  if (!user || user.role !== "USER") {
    return <div className="text-center py-20">Only users can view their trainer</div>;
  }
  const handleRequestTrainer = () => {
    navigate("/find-trainer");
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Trainer</h1>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : myTrainer ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-white">
                  {myTrainer.firstName[0]}{myTrainer.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">
                  {myTrainer.firstName} {myTrainer.lastName}
                </h2>
                <p className="text-gray-500 mt-1">Your assigned trainer</p>
              </div>
              <CheckCircle className="text-green-500" size={28} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" size={20} />
                <span className="text-gray-700">{myTrainer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Dumbbell className="text-orange-600" size={20} />
                <span className="text-gray-700 text-capitalize">{myTrainer.role?.toLowerCase()}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What your trainer can do:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <Dumbbell className="text-blue-500" size={18} />
                  Create custom exercises for you
                </li>
                <li className="flex items-center gap-3">
                  <Dumbbell className="text-green-500" size={18} />
                  Assign training plans to you
                </li>
                <li className="flex items-center gap-3">
                  <Dumbbell className="text-purple-500" size={18} />
                  View your workout progress
                </li>
                <li className="flex items-center gap-3">
                  <Dumbbell className="text-orange-500" size={18} />
                  Track your weekly/monthly stats
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <AlertCircle className="text-gray-300 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No trainer assigned yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Connect with a certified trainer to get personalized workout plans, exercise guidance, and progress tracking.
            </p>
            <button
              onClick={handleRequestTrainer}
              disabled={loading}
              className="px-8 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Find a Trainer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}