import { useEffect, useState } from "react";
import { useTrainerStore } from "../../store/useTrainerStore";
import { toast, ToastContainer } from "react-toastify";
import { Search } from "lucide-react";
import { TrainerCard } from "../../Components/TrainerCard/TrainerCard";

document.title = "Find Trainer";
export function FindTrainer() {
  const { trainers, fetchTrainers, requestTrainer, loading, error } = useTrainerStore();
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);
  const filteredTrainers = trainers.filter(
    (t) =>
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );
  const handleRequest = async (trainerId: string) => {
    try {
      await requestTrainer(trainerId);
      toast.success("Trainer request sent successfully!");
    } catch (err) {
      toast.error("You already have a trainer");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Find Your Trainer</h1>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search trainers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading trainers...</p>
          </div>
        ) : filteredTrainers.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No trainers found</h2>
            <p className="text-gray-500">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onRequest={handleRequest}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}