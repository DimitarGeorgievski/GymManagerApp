import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FoodCard } from "../../Components/FoodCard/FoodCard";
import { useFoodStore } from "../../store/useFoodStore";
import { SearchInput } from "../../Components/SearchInput/SearchInput";

document.title = "Exercise";
export function FoodPage() {
  const { fetchFoods, foods } = useFoodStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const itemsPerPage = 3;
    const filteredFoods = (foods ?? []).filter((foods) =>
    foods.name.toLowerCase().includes((searchQuery ?? "").toLowerCase()),
  );
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFoods = filteredFoods.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const onSearch = useCallback(
    (value: string) => {
      setSearchParams(value ? { q: value } : {});
    },
    [setSearchParams],
  );
  useEffect(() => {
    if (!foods?.length) {
      fetchFoods();
    }
  }, [fetchFoods, foods?.length]);
  return (
    <div className="p-12">
      <h1 className="text-center text-3xl font-bold pb-12">Food Database</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-6 items-center">
          <p>Filter By:</p>
          <SearchInput defaultValue={searchQuery} onSearch={onSearch} />
        </div>
        <Link
          to="/food/create"
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
        >
          Create Food
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFoods.map((food) => (
          <FoodCard key={food.name} food={food} />
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
