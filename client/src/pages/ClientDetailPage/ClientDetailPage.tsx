import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrainerStore } from "../../store/useTrainerStore";
import { usePlanStore } from "../../store/usePlanStore";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import { toast, ToastContainer } from "react-toastify";
import { Dumbbell, Calendar, AlertCircle, CheckCircle, Plus, Clock, ArrowLeft, Trash2, UserMinus } from "lucide-react";
import type { Workout } from "../../models/workout.model";
import type { Plans } from "../../models/user.model";

document.title = "Client Detail";
export function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const {
    clientWorkouts,
    fetchClientWorkouts,
    fetchClientActiveWorkout,
    clientActiveWorkout,
    assignPlanToClient,
    assignWorkoutToClient,
    removeClient,
    removePlanFromClient,
    removeWorkoutFromClient,
    loading,
    error
  } = useTrainerStore();
  const { plans, fetchPlans, fetchClientActivePlan, clientActivePlan } = usePlanStore();
  const { workouts: trainerWorkouts, fetchWorkouts: fetchTrainerWorkouts } = useWorkoutStore();
  const [activeTab, setActiveTab] = useState<"workouts" | "assign-plan" | "assign-workout">("workouts");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

  useEffect(() => {
    if (clientId) {
      fetchClientWorkouts(clientId);
      fetchPlans();
      fetchTrainerWorkouts();
      fetchClientActivePlan(clientId);
      fetchClientActiveWorkout(clientId);
    }
  }, [clientId, fetchClientWorkouts, fetchPlans, fetchTrainerWorkouts, fetchClientActivePlan, fetchClientActiveWorkout]);
  if (!clientId) {
    return <div className="text-center py-20">Client ID not found</div>;
  }
  const handleAssignPlan = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }
    try {
      await assignPlanToClient(clientId, selectedPlanId);
      toast.success("Plan assigned successfully!");
      setSelectedPlanId("");
      fetchClientActivePlan(clientId);
    } catch (err) {
      toast.error("Failed to assign plan");
    }
  };
  const handleAssignWorkout = async () => {
    if (!selectedWorkoutId) {
      toast.error("Please select a workout");
      return;
    }
    try {
      await assignWorkoutToClient(clientId, selectedWorkoutId);
      toast.success("Workout assigned successfully!");
      setSelectedWorkoutId("");
      fetchClientWorkouts(clientId);
      fetchClientActiveWorkout(clientId);
    } catch (err) {
      toast.error("Failed to assign workout");
    }
  };
  const handleRemoveClient = async () => {
    try {
      await removeClient(clientId);
      toast.success("Client removed successfully!");
      navigate("/trainer/dashboard");
    } catch (err) {
      toast.error("Failed to remove client");
    }
  };
  const handleRemoveWorkout = async (workoutId: string) => {
    try {
      await removeWorkoutFromClient(clientId, workoutId);
      toast.success("Workout removed successfully!");
      fetchClientWorkouts(clientId);
      fetchClientActiveWorkout(clientId);
    } catch (err) {
      toast.error("Failed to remove workout");
    }
  };
  const handleRemovePlan = async (planId: string) => {
    try {
      await removePlanFromClient(clientId, planId);
      toast.success("Plan removed successfully!");
      fetchClientActivePlan(clientId);
    } catch (err) {
      toast.error("Failed to remove plan");
    }
  };
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/trainer/dashboard")}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="text-white" size={24} />
            </button>
            <h1 className="text-3xl font-bold text-white">Client Workouts</h1>
          </div>
          <button
            onClick={handleRemoveClient}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <UserMinus size={18} />
            Remove Client
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("workouts")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors cursor-pointer ${
                activeTab === "workouts"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Dumbbell className="inline mr-1" size={16} />
              Workouts
            </button>
            <button
              onClick={() => setActiveTab("assign-plan")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors cursor-pointer ${
                activeTab === "assign-plan"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Plus className="inline mr-1" size={16} />
              Assign Plan
            </button>
            <button
              onClick={() => setActiveTab("assign-workout")}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors cursor-pointer ${
                activeTab === "assign-workout"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Dumbbell className="inline mr-1" size={16} />
              Assign Workout
            </button>
          </nav>
        </div>
        {activeTab === "workouts" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : clientWorkouts.length === 0 ? (
              <div className="text-center py-16">
                <Dumbbell className="text-gray-300 mx-auto mb-4" size={48} />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No workouts yet</h2>
                <p className="text-gray-500">This client hasn't logged any workouts yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {clientWorkouts.map((workout: Workout) => (
                  <div key={workout.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{workout.title}</h3>
                        <p className="text-sm text-gray-500">{workout.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(workout.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {workout.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell size={16} />
                          {workout.workoutExercises?.length || 0} exercises
                        </span>
                        <button
                          onClick={() => handleRemoveWorkout(workout.id)}
                          disabled={loading}
                          className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                    {workout.workoutExercises && workout.workoutExercises.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {workout.workoutExercises.map((we, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {we.exercise?.name || "Unknown"} ({we.sets}×{we.reps})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "assign-plan" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Assign Training Plan</h2>
            {clientActivePlan && (
              <div className="mb-6 p-4 border-2 border-green-500 bg-green-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Current Active Plan
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{clientActivePlan.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(clientActivePlan.startDate).toLocaleDateString()} - {new Date(clientActivePlan.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{clientActivePlan.description || "No description"}</p>
                  </div>
                  <button
                    onClick={() => handleRemovePlan(clientActivePlan.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            )}
            {plans?.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="text-gray-300 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No plans available</h3>
                <p className="text-gray-500">Create a plan first to assign it to this client.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {plans?.map((plan: Plans) => (
                  <div
                    key={plan.id}
                    className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      selectedPlanId === plan.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPlanId(selectedPlanId === plan.id ? "" : plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedPlanId === plan.id ? "bg-blue-500" : "bg-gray-100"
                        }`}>
                          <CheckCircle
                            size={20}
                            className={selectedPlanId === plan.id ? "text-white" : "text-gray-400"}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{plan.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">{plan.description || "No description"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedPlanId && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAssignPlan}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={20} />
                  Assign Selected Plan
                </button>
              </div>
            )}
          </div>
        )}
        {activeTab === "assign-workout" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Assign Workout</h2>
            {clientActiveWorkout && (
              <div className="mb-6 p-4 border-2 border-purple-500 bg-purple-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="text-purple-600" size={20} />
                  Today's Workout
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{clientActiveWorkout.title}</h4>
                    <p className="text-sm text-gray-500">{clientActiveWorkout.description || "No description"}</p>
                    <p className="text-sm text-gray-500">
                      {clientActiveWorkout.durationMinutes} min • {clientActiveWorkout.workoutExercises?.length || 0} exercises
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveWorkout(clientActiveWorkout.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            )}
            {trainerWorkouts?.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="text-gray-300 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No workouts available</h3>
                <p className="text-gray-500">Create a workout first to assign it to this client.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainerWorkouts?.map((workout: Workout) => (
                  <div
                    key={workout.id}
                    className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      selectedWorkoutId === workout.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedWorkoutId(selectedWorkoutId === workout.id ? "" : workout.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedWorkoutId === workout.id ? "bg-purple-500" : "bg-gray-100"
                        }`}>
                          <CheckCircle
                            size={20}
                            className={selectedWorkoutId === workout.id ? "text-white" : "text-gray-400"}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{workout.title}</h3>
                          <p className="text-sm text-gray-500">{workout.description || "No description"}</p>
                          <p className="text-sm text-gray-500">
                            {workout.durationMinutes} min • {workout.workoutExercises?.length || 0} exercises
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedWorkoutId && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAssignWorkout}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={20} />
                  Assign Selected Workout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}