import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, Building, PlusCircle, Pencil, Trash2, X } from "lucide-react";
import useUser from "../components/useUser";
import AddPgForm from "./AddPg";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myPgs");
  const { user, logout } = useUser();
  const [pgs, setPgs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  // const [editPgData, setEditPgData] = useState(null);
  const [editPgData, setEditPgData] = useState();
  const [newImages, setNewImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setNewImages((prev) => [...prev, ...acceptedFiles]);
    },
  });
  useEffect(() => {
    setActiveTab("myPgs");
    fetchMyPgs();
  }, []);

  const fetchMyPgs = async () => {

    try {
      const res = await fetch(`http://localhost:8000/api/v1/pg/owner/${user.id}`);
      const data = await res.json();


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
        toast.success("PG deleted successfully!");
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPgData),
      });
      if (res.ok) {
        toast.success("PG edited successfully!");
        setEditMode(false);
        setEditPgData(null);
        fetchMyPgs();
      }
    } catch (err) {
      toast.error("Failed to edit PG!");
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
              className={`flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-gray-800 ${activeTab === "myPgs" ? "bg-gray-800" : ""
                }`}
              onClick={() => setActiveTab("myPgs")}
            >
              <Building className="w-4 h-4" />
              My PGs
            </button>
            <button
              className={`flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-gray-800 ${activeTab === "addPg" ? "bg-gray-800" : ""
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
                  <h2 className="text-lg font-bold">{pg.pgName}</h2>
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
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this PG?")) {
                          handleDelete(pg._id);
                        }
                      }}
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
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">                <form
                  onSubmit={handleEditSubmit}
                  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                >
                  <h2 className="text-xl font-bold mb-4">Edit PG</h2>

                  <label className="block mb-1 font-medium">PG Name</label>
                  <input
                    type="text"
                    value={editPgData.pgName}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, pgName: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    required
                  />

                  <label className="block mb-1 font-medium">Address</label>
                  <input
                    type="text"
                    value={editPgData.address}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, address: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    required
                  />

                  <label className="block mb-1 font-medium">Contact Number</label>
                  <input
                    type="text"
                    value={editPgData.contact}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, contact: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    required
                  />

                  <label className="block mb-1 font-medium">Rooms Vacant</label>
                  <input
                    type="number"
                    value={editPgData.roomsVacant}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, roomsVacant: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    required
                  />

                  <label className="block mb-1 font-medium">Rent (₹)</label>
                  <input
                    type="number"
                    value={editPgData.rent}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, rent: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    required
                  />

                  <label className="block mb-1 font-medium">City</label>
                  <input
                    type="text"
                    value={editPgData.cityName}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, cityName: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    required
                  />

                  {/* Image Upload */}
                  <label className="block font-medium mb-1">Images</label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed px-6 py-12 rounded cursor-pointer text-center ${isDragActive ? "bg-gray-100" : "bg-gray-50"
                      }`}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop images here...</p>
                    ) : (
                      <p>Drag & drop or click to select images</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    {/* Previously uploaded images */}
                    {editPgData.images &&
                      Array.isArray(editPgData.images) &&
                      editPgData.images.map((url, index) => (
                        <div key={`existing-${index}`} className="relative w-24 h-24">
                          <img
                            src={url}
                            alt="PG"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = editPgData.images.filter(
                                (_, i) => i !== index
                              );
                              setEditPgData({ ...editPgData, images: updatedImages });
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs hover:bg-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                    {/* New images preview */}
                    {newImages &&
                      newImages.map((file, index) => (
                        <div key={`new-${index}`} className="relative w-24 h-24">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="New"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newImages];
                              updated.splice(index, 1);
                              setNewImages(updated);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs hover:bg-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>

                  <label className="block mb-1 font-medium mt-4">Description</label>
                  <textarea
                    value={editPgData.description}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    rows="3"
                  />

                  <label className="block mb-1 font-medium">
                    Nearby Colleges (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editPgData.collegeNames}
                    onChange={(e) =>
                      setEditPgData({ ...editPgData, collegeNames: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                  />

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
              </div>
            )}




          </div>
        )}

        {activeTab === "addPg" && <AddPgForm onPgAdded={fetchMyPgs} />}
      </main>
    </div>
  );
};

export default OwnerDashboard;
