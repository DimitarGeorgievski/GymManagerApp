import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchInput } from "../../Components/SearchInput/SearchInput";
import { usePlanStore } from "../../store/usePlanStore";
import { useUserStore } from "../../store/useUserStore";
import { PlanCard } from "../../Components/PlanCard/PlanCard";
import { roleType } from "../../models/user.model";

document.title = "Plan";
export function PlanPage() {
  const { plans, fetchPlans } = usePlanStore();
  const user = useUserStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const itemsPerPage = 3;
  const filteredPlans = (plans ?? []).filter((plan) =>
    plan.title.toLowerCase().includes((searchQuery ?? "").toLowerCase()),
  );
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlans = filteredPlans.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const onSearch = useCallback(
    (value: string) => {
      setSearchParams(value ? { q: value } : {});
    },
    [setSearchParams],
  );
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  return (
    <div className="p-12">
      <h1 className="text-center text-3xl font-bold pb-16">Plans Page</h1>
      <div className="flex justify-between items-center px-6 mb-4">
        <div className="flex gap-4 items-center">
          <p>Filter By:</p>
          <SearchInput defaultValue={searchQuery} onSearch={onSearch} />
        </div>
        {user?.role === roleType.TRAINER || user?.role === roleType.ADMIN && (
          <Link
            to={"/plan/create"}
            className="bg-blue-500 font-semibold text-white cursor-pointer p-2 rounded"
          >
            Create Plan
          </Link>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {currentPlans?.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 border cursor-pointer rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border cursor-pointer rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
