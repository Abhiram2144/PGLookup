import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Building, PlusCircle, Pencil, Trash2, X } from "lucide-react";
import useUser from "../components/useUser";
import AddPgForm from "./AddPg";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myPgs");
  const { user, logout } = useUser();
  const [pgs, setPgs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPgData, setEditPgData] = useState(null);

  useEffect(() => {
    setActiveTab("myPgs");
    fetchMyPgs();
  }, []);

  const fetchMyPgs = async () => {

  try {
    console.log("user.id:", user.id);
    const res = await fetch(`http://localhost:8000/api/v1/pg/owner/${user.id}`);
    const data = await res.json();

    console.log("Fetched PGs:", data.pgs);

    if (Array.isArray(data.pgs)) {
      setPgs(data.pgs);
    } else {
      console.error("Expected an array but got:", data);
      setPgs([]); // fallback
    }
  } catch (err) {
    console.error("Failed to fetch PGs:", err);
    setPgs([]);
  }
};


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

  const handleDelete = async (pgId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/pg/delete/${pgId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMyPgs();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/pg/edit/${editPgData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPgData),
      });
      if (res.ok) {
        setEditMode(false);
        setEditPgData(null);
        fetchMyPgs();
      }
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
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

      <main className="flex-1 p-6">
        {activeTab === "myPgs" && (
          <div>
            <h1 className="text-2xl font-semibold mb-4">My PGs</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pgs.map((pg) => (
                <div key={pg._id} className="bg-white p-4 rounded shadow relative">
                  <h2 className="text-lg font-bold">{pg.name}</h2>
                  <p className="text-sm text-gray-600">{pg.address}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => {
                        setEditPgData(pg);
                        setEditMode(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(pg._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editMode && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <form
                  onSubmit={handleEditSubmit}
                  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                >
                  <h2 className="text-xl font-bold mb-4">Edit PG</h2>
                  <input
                    type="text"
                    value={editPgData.name}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    placeholder="Name"
                    required
                  />
                  <input
                    type="text"
                    value={editPgData.address}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, address: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    placeholder="Address"
                    required
                  />
                  {/* Add more fields as needed */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setEditPgData(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === "addPg" && <AddPgForm />}
      </main>
    </div>
  );
};

export default OwnerDashboard;
