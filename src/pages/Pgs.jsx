const Pgs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Available PGs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder cards */}
        {[1, 2, 3].map((pg) => (
          <div
            key={pg}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg">PG Name {pg}</h2>
            <p className="text-sm text-gray-600">City, Rent ₹XXXX</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pgs;
