const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>
      <div className="grid gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">My PGs</h2>
          <p className="text-sm text-gray-600">List of your uploaded PGs.</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">Student Requests</h2>
          <p className="text-sm text-gray-600">No new requests yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
