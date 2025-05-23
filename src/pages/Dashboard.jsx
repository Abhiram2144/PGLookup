import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Building, PlusCircle } from "lucide-react";
import useUser from "../components/useUser";
import AddPgForm from "./AddPg"; // Adjust the path if needed

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myPgs");
  const { user, logout } = useUser();

  useEffect(() => {
    setActiveTab("myPgs");
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        logout();
        setTimeout(() => navigate("/login"), 500);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between p-4">
        <div>
          <div
            className="text-2xl font-bold mb-6 cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            PGFinder
          </div>

          <nav className="flex flex-col gap-4">
            <button
              className={`flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-gray-800 ${
                activeTab === "myPgs" ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveTab("myPgs")}
            >
              <Building className="w-4 h-4" />
              My PGs
            </button>
            <button
              className={`flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-gray-800 ${
                activeTab === "addPg" ? "bg-gray-800" : ""
              }`}
              onClick={() => setActiveTab("addPg")}
            >
              <PlusCircle className="w-4 h-4" />
              Add PG
            </button>
            <button
              className="flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-gray-800 opacity-50 cursor-not-allowed"
              disabled
            >
              Notifications
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 rounded text-white bg-red-500 hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "myPgs" && (
          <div>
            <h1 className="text-2xl font-semibold mb-4">My PGs</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold">Sunrise Hostel</h2>
                <p className="text-sm text-gray-600">Near XYZ College, Delhi</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold">Blue Moon PG</h2>
                <p className="text-sm text-gray-600">Sector 21, Noida</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "addPg" && <AddPgForm />}
      </main>
    </div>
  );
};

export default OwnerDashboard;
