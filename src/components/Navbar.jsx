import { Link, useNavigate } from "react-router-dom";
import useUser from "./useUser";
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "GET",
        credentials: "include",
      });
      console.log(res);

      if (res.ok) {
        logout(); // update context + localStorage
        toast.success("Successfully logged out!");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 border-b border-gray-300 shadow-sm py-4 px-6 flex justify-between items-center z-40">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        PGLookUp
      </Link>
      <div className="space-x-4">
        <Link
          to="/pg-list"
          className="bg-white text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
        >
          Look PGs
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition hover:cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-white hover:text-gray-800 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
