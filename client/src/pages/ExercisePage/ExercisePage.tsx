export function ExercisePage() {
  return (
    <div className="p-12">
      <h1 className="text-center text-3xl font-bold pb-16">Exercise Page</h1>
      <div className="flex justify-between items-center px-12 mb-4">
        <div className="flex gap-4 items-center">
          <p>Filter By:</p>
          <select className="p-2 focus:outline-none border rounded">
            <option value="">All Muscle Groups</option>
            <option value="CHEST">Chest</option>
            <option value="BACK">Back</option>
          </select>
          <input
            type="text"
            placeholder="Search exercise..."
            className="focus:outline-none p-2 border rounded w-"
          />
        </div>
        <button className="bg-blue-500 font-semibold text-white p-2 rounded">
          Create Exercise
        </button>
      </div>
    </div>
  );
}
