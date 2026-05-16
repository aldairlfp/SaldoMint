function CategoryStats({ stats }) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Category Stats
      </h2>
      <div className="flex flex-wrap gap-4">
        {Object.entries(stats).map(([category, total]) => (
          <div
            key={category}
            className="bg-white shadow-md rounded-lg p-4 min-w-40"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
              {category}
            </p>
            <p className="text-green-500 font-bold">${total.total_income}</p>
            <p className="text-red-500 font-bold">${total.total_expense}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default CategoryStats;
