import { useCallback, useEffect, useMemo, useState } from "react";
import { useExerciseStore } from "../../store/useExerciseStore";
import { Link, useSearchParams } from "react-router-dom";
import { MuscleGroup } from "../../models/exercise.model";
import { ExerciseCard } from "../../Components/ExerciseCard/ExerciseCard";
import { SearchInput } from "../../Components/SearchInput/SearchInput";
import { useUserStore } from "../../store/useUserStore";
import { roleType } from "../../models/user.model";

document.title = "Exercise";
export function ExercisePage() {
  const { exercises, fetchExercises } = useExerciseStore();
  const user = useUserStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const itemsPerPage = 3;
  const filteredExercises = useMemo(
  () =>
    (exercises ?? []).filter((exercise) =>
      exercise.name.toLowerCase().includes((searchQuery ?? "").toLowerCase()),
    ),
  [exercises, searchQuery],
);
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExercises = filteredExercises.slice(
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
    if (!exercises?.length) {
      fetchExercises();
    }
  }, [fetchExercises, exercises?.length]);
  useEffect(() => {
    if (searchQuery) onSearch(searchQuery);
  }, [searchQuery, onSearch]);
  return (
    <div className="p-12">
      <h1 className="text-center text-3xl font-bold pb-16">Exercise Page</h1>
      <div className="flex justify-between items-center px-6 mb-4">
        <div className="flex gap-4 items-center">
          <p>Filter By:</p>
          <select className="p-2 focus:outline-none border rounded">
            <option value="">All Muscle Groups</option>
            {Object.values(MuscleGroup).map((mg) => (
              <option key={mg} value={mg}>
                {mg}
              </option>
            ))}
          </select>
          <SearchInput defaultValue={searchQuery} onSearch={onSearch} />
        </div>
        {user?.role === roleType.TRAINER || user?.role === roleType.ADMIN && (
          <Link
            to={"/exercise/create"}
            className="bg-blue-500 font-semibold text-white cursor-pointer p-2 rounded"
          >
            Create Exercise
          </Link>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {currentExercises?.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
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
