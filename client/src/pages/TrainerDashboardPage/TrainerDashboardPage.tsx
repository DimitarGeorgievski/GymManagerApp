import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainerStore } from "../../store/useTrainerStore";
import { useUserStore } from "../../store/useUserStore";
import { toast, ToastContainer } from "react-toastify";
import { Users, UserPlus, Clock } from "lucide-react";
import type { TrainerSwitchRequest } from "../../models/user.model";
import { ClientCard } from "../../Components/ClientCard/ClientCard";
import { PendingRequestCard } from "../../Components/PendingRequestCard/PendingRequestCard";

document.title = "Trainer Dashboard";
export function TrainerDashboard() {
  const navigate = useNavigate();
  const {
    clients,
    fetchClients,
    pendingRequests,
    fetchPendingRequests,
    decideRequest,
    loading,
    error,
  } = useTrainerStore();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<"clients" | "requests">("clients");
  useEffect(() => {
    fetchClients();
    fetchPendingRequests();
  }, [fetchClients, fetchPendingRequests]);
  if (!user || (user.role !== "TRAINER" && user.role !== "ADMIN")) {
    return (
      <div className="text-center py-20">
        Only trainers can access this page
      </div>
    );
  }
  const handleApprove = async (requestId: string) => {
    try {
      await decideRequest(requestId, true);
      fetchClients();
      toast.success("Request approved!");
    } catch (err) {
      toast.error("Failed to approve request");
    }
  };
  const handleReject = async (requestId: string) => {
    try {
      await decideRequest(requestId, false);
      toast.success("Request rejected");
    } catch (err) {
      toast.error("Failed to reject request");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
            {user.role}
          </span>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-4 cursor-pointer py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "clients"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="inline mr-1" size={16} />
              My Clients ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 cursor-pointer font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "requests"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus className="inline mr-1" size={16} />
              Pending Requests ({pendingRequests.length})
            </button>
          </nav>
        </div>
        {activeTab === "clients" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-16">
                <Users className="text-gray-300 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No clients yet
                </h2>
                <p className="text-gray-500">
                  Users will appear here once they request you as their trainer
                  and you approve.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {clients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onClick={() => navigate(`/trainer/clients/${client.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "requests" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="text-gray-300 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No pending requests
                </h2>
                <p className="text-gray-500">
                  Trainer requests from users will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingRequests.map((request: TrainerSwitchRequest) => (
                  <PendingRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
